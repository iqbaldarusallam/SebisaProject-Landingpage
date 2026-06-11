import { prisma } from "@/lib/db";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid service id"), {
        status: 400,
      });
    }

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return Response.json(errorResponse("Service not found"), {
        status: 404,
      });
    }

    return Response.json(successResponse(service));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching service",
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
      return Response.json(errorResponse("Invalid service id"), {
        status: 400,
      });
    }

    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const service = await prisma.service.update({
      where: { id },
      data: parsed.data,
    });

    return Response.json(successResponse(service, "Service updated"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error updating service",
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
      return Response.json(errorResponse("Invalid service id"), {
        status: 400,
      });
    }

    const service = await prisma.service.delete({
      where: { id },
    });

    return Response.json(successResponse(service, "Service deleted"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error deleting service",
      ),
      { status: 500 },
    );
  }
}
