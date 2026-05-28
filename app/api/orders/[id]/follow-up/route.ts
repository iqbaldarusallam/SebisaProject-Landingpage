import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!Number.isFinite(id)) {
      return NextResponse.json(errorResponse("Invalid order id"), {
        status: 400,
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { followedUpAt: new Date() },
    });

    return NextResponse.json(successResponse(order, "Order sudah difollow up"));
  } catch (error) {
    console.error(error);
    return NextResponse.json(errorResponse("Gagal update follow up order"), {
      status: 500,
    });
  }
}
