import { NextResponse } from "next/server";
import { reconcileCheckoutStatus } from "@/lib/checkout-webhook";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ ok: false, message: "orderId is required" }, { status: 400 });
    }

    const result = await reconcileCheckoutStatus(orderId);

    if (!result.ok) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Checkout status error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { ok: false, message: "Failed to verify order status" },
      { status: 500 },
    );
  }
}
