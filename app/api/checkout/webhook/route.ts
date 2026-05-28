import { NextRequest, NextResponse } from "next/server";
import { processCheckoutWebhook } from "@/lib/checkout-webhook";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await processCheckoutWebhook(body);

    return NextResponse.json(result.response, {
      status: result.status,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Checkout webhook error:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
