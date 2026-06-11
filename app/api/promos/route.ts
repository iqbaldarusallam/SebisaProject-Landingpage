import { prisma } from "@/lib/db";
import { promoSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-utils";
import {
  expireEndedPromos,
  findBlockingCountdownPromo,
  getCountdownConflictMessage,
} from "@/lib/promo-expiration";

export async function GET() {
  try {
    await expireEndedPromos();

    const promos = await prisma.promo.findMany({
      include: { packages: { include: { package: true } } },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(successResponse(promos));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching promos",
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const now = new Date();
    await expireEndedPromos(now);

    const body = await request.json();
    const parsed = promoSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const { packageIds, ...promoData } = parsed.data;

    const endDate = promoData.endDate ? new Date(promoData.endDate) : undefined;
    const preparedData = {
      ...promoData,
      startDate: promoData.startDate
        ? new Date(promoData.startDate)
        : undefined,
      endDate,
      isActive: endDate && endDate < now ? false : promoData.isActive,
    };

    const blockingPromo = await findBlockingCountdownPromo({
      endDate,
      isActive: Boolean(preparedData.isActive),
      now,
      showCountdown: Boolean(preparedData.showCountdown),
    });

    if (blockingPromo) {
      return Response.json(errorResponse(getCountdownConflictMessage(blockingPromo)), {
        status: 409,
      });
    }

    const promo = await prisma.promo.create({
      data: {
        ...preparedData,
        packages: packageIds.length
          ? {
              create: packageIds.map((packageId) => ({ packageId })),
            }
          : undefined,
      },
    });

    return Response.json(successResponse(promo, "Promo created"), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error creating promo",
      ),
      { status: 500 },
    );
  }
}
