import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validations";
import { calculateOrderTotal, generateOrderId } from "@/lib/utils";
import { createMidtransTransaction } from "@/lib/midtrans";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message || "Invalid order data",
        errors: parsed.error.format(),
      },
      { status: 400 },
    );
  }

  const validated = parsed.data;

  try {
    const pricing = await calculateOrderTotal(
      validated.packageId,
      validated.promoCode || undefined,
    );

    if (pricing.total <= 0) {
      return NextResponse.json(
        { ok: false, message: "Invalid order total" },
        { status: 400 },
      );
    }

    const packageData = await prisma.package.findUnique({
      where: { id: validated.packageId },
    });

    if (!packageData) {
      return NextResponse.json(
        {
          ok: false,
          message: "Package not found. Please select a valid package.",
        },
        { status: 404 },
      );
    }

    const orderId = generateOrderId();

    const order = await prisma.order.create({
      data: {
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        packageId: validated.packageId,
        promoId: pricing.promoId,
        totalPrice: pricing.total,
        status: "pending",
        transactionId: orderId,
      },
    });

    const snapToken = await createMidtransTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(pricing.total),
      },
      customer_details: {
        email: validated.customerEmail,
        phone: validated.customerPhone,
        first_name: validated.customerName,
      },
      item_details: [
        {
          id: String(validated.packageId),
          name: packageData.name,
          price: Math.round(pricing.total),
          quantity: 1,
        },
      ],
      callbacks: {
        finish: `${request.nextUrl.origin}/checkout/success`,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Order created",
        data: {
          orderId: order.id,
          transactionId: orderId,
          snapToken,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Checkout failed",
      },
      { status: 500 },
    );
  }
}
