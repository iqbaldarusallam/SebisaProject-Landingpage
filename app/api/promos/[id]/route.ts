import { prisma } from "@/lib/db";
import { promoSchema } from "@/lib/validations";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";
import {
  expireEndedPromos,
  findBlockingCountdownPromo,
  getCountdownConflictMessage,
} from "@/lib/promo-expiration";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await expireEndedPromos();

    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid promo id"), { status: 400 });
    }

    const promo = await prisma.promo.findUnique({
      where: { id },
      include: { packages: { include: { package: true } } },
    });

    if (!promo) {
      return Response.json(errorResponse("Promo not found"), { status: 404 });
    }

    return Response.json(successResponse(promo));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching promo",
      ),
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const now = new Date();
    await expireEndedPromos(now);

    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid promo id"), { status: 400 });
    }

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
      excludeId: id,
      isActive: Boolean(preparedData.isActive),
      now,
      showCountdown: Boolean(preparedData.showCountdown),
    });

    if (blockingPromo) {
      return Response.json(errorResponse(getCountdownConflictMessage(blockingPromo)), {
        status: 409,
      });
    }

    const promo = await prisma.promo.update({
      where: { id },
      data: {
        ...preparedData,
        packages: {
          deleteMany: {},
          create: packageIds.map((packageId) => ({ packageId })),
        },
      },
    });

    return Response.json(successResponse(promo, "Promo updated"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error updating promo",
      ),
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid promo id"), { status: 400 });
    }

    const existingPromo = await prisma.promo.findUnique({
      where: { id },
    });

    if (!existingPromo) {
      return Response.json(errorResponse("Promo not found"), { status: 404 });
    }

    const promo = await prisma.$transaction(async (tx) => {
      await tx.order.updateMany({
        where: { promoId: id },
        data: { promoId: null },
      });

      await tx.promoPackage.deleteMany({
        where: { promoId: id },
      });

      return tx.promo.delete({
        where: { id },
      });
    });

    return Response.json(successResponse(promo, "Promo deleted"));
  } catch (error) {
    console.error("Error deleting promo:", error);
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error deleting promo",
      ),
      { status: 500 },
    );
  }
}
