import { after, NextRequest, NextResponse } from "next/server";
import { processCheckoutWebhook } from "@/lib/checkout-webhook";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, X-Requested-With, X-CSRF-Token, X-Api-Version",
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

    after(async () => {
      try {
        const result = await processCheckoutWebhook(body);

        if (result.status >= 400) {
          console.warn("Midtrans webhook ignored", {
            status: result.status,
            message: result.response.message,
          });
        }
      } catch (error) {
        console.error(
          "Checkout webhook processing error:",
          error instanceof Error ? error.message : error,
        );
      }
    });

    return NextResponse.json(
      { ok: true, message: "Notification received" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Checkout webhook parse error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid webhook payload",
      },
      { status: 400, headers: corsHeaders },
    );
  }
}
