import { prisma } from "@/lib/db";
import { testimonialSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { id: "asc" },
    });
    return Response.json(successResponse(testimonials));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching testimonials",
      ),
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name: parsed.data.name,
        brand: parsed.data.brand,
        content: parsed.data.content,
        rating: parsed.data.rating,
      },
    });

    return Response.json(successResponse(testimonial, "Testimonial created"), {
      status: 201,
    });
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error creating testimonial",
      ),
      { status: 500 },
    );
  }
}
