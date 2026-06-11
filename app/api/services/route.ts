import { prisma } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { serviceSchema } from "@/lib/validations";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });

    return Response.json(successResponse(services));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching services",
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const service = await prisma.service.create({
      data: parsed.data,
    });

    return Response.json(successResponse(service, "Service created"), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error creating service",
      ),
      { status: 500 },
    );
  }
}
