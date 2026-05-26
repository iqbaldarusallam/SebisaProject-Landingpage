import { prisma } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { trustedBrandSchema } from "@/lib/validations";

export async function GET() {
  try {
    const brands = await prisma.trustedBrand.findMany({
      orderBy: { id: "asc" },
    });

    return Response.json(successResponse(brands));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching brand logos",
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trustedBrandSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const brand = await prisma.trustedBrand.create({
      data: parsed.data,
    });

    return Response.json(successResponse(brand, "Brand logo created"), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error creating brand logo",
      ),
      { status: 500 },
    );
  }
}
