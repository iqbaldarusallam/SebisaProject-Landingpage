import { NextRequest, NextResponse } from "next/server";
import { processMidtransWebhook } from "@/lib/midtrans-webhook";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await processMidtransWebhook(body);

    return NextResponse.json(result.response, { status: result.status });
  } catch (error) {
    console.error("Midtrans webhook error:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 },
    );
  }
}
