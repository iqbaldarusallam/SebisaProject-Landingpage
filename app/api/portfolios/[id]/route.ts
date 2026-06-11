import { prisma } from "@/lib/db";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";
import { portfolioSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid portfolio id"), {
        status: 400,
      });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      return Response.json(errorResponse("Portfolio not found"), {
        status: 404,
      });
    }

    return Response.json(successResponse(portfolio));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching portfolio",
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
      return Response.json(errorResponse("Invalid portfolio id"), {
        status: 400,
      });
    }

    const body = await request.json();
    const parsed = portfolioSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: parsed.data,
    });

    return Response.json(successResponse(portfolio, "Portfolio updated"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error updating portfolio",
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
      return Response.json(errorResponse("Invalid portfolio id"), {
        status: 400,
      });
    }

    const portfolio = await prisma.portfolio.delete({
      where: { id },
    });

    return Response.json(successResponse(portfolio, "Portfolio deleted"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error deleting portfolio",
      ),
      { status: 500 },
    );
  }
}
