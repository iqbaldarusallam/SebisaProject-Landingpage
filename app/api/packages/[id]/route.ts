import { prisma } from "@/lib/db";
import { packageSchema } from "@/lib/validations";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid package id"), { status: 400 });
    }

    const pkg = await prisma.package.findUnique({
      where: { id },
    });

    if (!pkg) {
      return Response.json(
        errorResponse("Package not found"),
        { status: 404 }
      );
    }

    return Response.json(successResponse(pkg));
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error fetching package"),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid package id"), { status: 400 });
    }

    const body = await request.json();
    const parsed = packageSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 }
      );
    }

    const pkg = await prisma.package.update({
      where: { id },
      data: parsed.data,
    });

    return Response.json(successResponse(pkg, "Package updated"));
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error updating package"),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid package id"), { status: 400 });
    }

    const pkg = await prisma.package.delete({
      where: { id },
    });

    return Response.json(successResponse(pkg, "Package deleted"));
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error deleting package"),
      { status: 500 }
    );
  }
}
