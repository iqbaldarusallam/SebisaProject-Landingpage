import { prisma } from "@/lib/db";
import { landingContentSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const content = await prisma.landingContent.findFirst();
    return Response.json(successResponse(content));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error
          ? error.message
          : "Error fetching landing content",
      ),
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = landingContentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const existing = await prisma.landingContent.findFirst();

    const content = existing
      ? await prisma.landingContent.update({
          where: { id: existing.id },
          data: parsed.data,
        })
      : await prisma.landingContent.create({
          data: parsed.data,
        });

    return Response.json(successResponse(content, "Landing content saved"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error saving landing content",
      ),
      { status: 500 },
    );
  }
}
