import { prisma } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { portfolioSchema } from "@/lib/validations";

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { id: "asc" },
    });

    return Response.json(successResponse(portfolios));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching portfolios",
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = portfolioSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const portfolio = await prisma.portfolio.create({
      data: parsed.data,
    });

    return Response.json(successResponse(portfolio, "Portfolio created"), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error creating portfolio",
      ),
      { status: 500 },
    );
  }
}
