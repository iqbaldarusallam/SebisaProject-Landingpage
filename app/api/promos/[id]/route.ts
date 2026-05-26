import { prisma } from "@/lib/db";
import { promoSchema } from "@/lib/validations";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    const preparedData = {
      ...promoData,
      startDate: promoData.startDate
        ? new Date(promoData.startDate)
        : undefined,
      endDate: promoData.endDate ? new Date(promoData.endDate) : undefined,
    };

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

    const promo = await prisma.promo.delete({
      where: { id },
    });

    return Response.json(successResponse(promo, "Promo deleted"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error deleting promo",
      ),
      { status: 500 },
    );
  }
}
