import { prisma } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        package: true,
        promo: true,
        paymentEvents: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            transactionStatus: true,
            fraudStatus: true,
            grossAmount: true,
            currency: true,
            transactionTime: true,
            settlementTime: true,
            signatureVerified: true,
            amountVerified: true,
            verificationSource: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(successResponse(orders), { status: 200 });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(errorResponse("Gagal mengambil orders"), {
      status: 500,
    });
  }
}
