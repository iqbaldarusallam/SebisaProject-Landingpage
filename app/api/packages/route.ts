import { prisma } from "@/lib/db";
import { packageSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(successResponse(packages));
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error fetching packages"),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = packageSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: parsed.data,
    });

    return Response.json(successResponse(pkg, "Package created"), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      errorResponse(error instanceof Error ? error.message : "Error creating package"),
      { status: 500 }
    );
  }
}
