import { prisma } from "@/lib/db";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";
import { trustedBrandSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid brand logo id"), {
        status: 400,
      });
    }

    const brand = await prisma.trustedBrand.findUnique({
      where: { id },
    });

    if (!brand) {
      return Response.json(errorResponse("Brand logo not found"), {
        status: 404,
      });
    }

    return Response.json(successResponse(brand));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching brand logo",
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
      return Response.json(errorResponse("Invalid brand logo id"), {
        status: 400,
      });
    }

    const body = await request.json();
    const parsed = trustedBrandSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const brand = await prisma.trustedBrand.update({
      where: { id },
      data: parsed.data,
    });

    return Response.json(successResponse(brand, "Brand logo updated"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error updating brand logo",
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
      return Response.json(errorResponse("Invalid brand logo id"), {
        status: 400,
      });
    }

    const brand = await prisma.trustedBrand.delete({
      where: { id },
    });

    return Response.json(successResponse(brand, "Brand logo deleted"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error deleting brand logo",
      ),
      { status: 500 },
    );
  }
}
