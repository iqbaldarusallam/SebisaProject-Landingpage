import { prisma } from "@/lib/db";
import { testimonialSchema } from "@/lib/validations";
import { successResponse, errorResponse, parseRouteId } from "@/lib/api-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = await parseRouteId(params);
    if (!id) {
      return Response.json(errorResponse("Invalid testimonial id"), {
        status: 400,
      });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return Response.json(errorResponse("Testimonial not found"), {
        status: 404,
      });
    }

    return Response.json(successResponse(testimonial));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error fetching testimonial",
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
      return Response.json(errorResponse("Invalid testimonial id"), {
        status: 400,
      });
    }

    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        errorResponse(parsed.error.issues[0]?.message || "Validation error"),
        { status: 400 },
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: parsed.data.name,
        brand: parsed.data.brand,
        content: parsed.data.content,
        rating: parsed.data.rating,
      },
    });

    return Response.json(successResponse(testimonial, "Testimonial updated"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error updating testimonial",
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
      return Response.json(errorResponse("Invalid testimonial id"), {
        status: 400,
      });
    }

    const testimonial = await prisma.testimonial.delete({
      where: { id },
    });

    return Response.json(successResponse(testimonial, "Testimonial deleted"));
  } catch (error) {
    return Response.json(
      errorResponse(
        error instanceof Error ? error.message : "Error deleting testimonial",
      ),
      { status: 500 },
    );
  }
}
