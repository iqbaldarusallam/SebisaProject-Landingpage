import { NextRequest, NextResponse } from "next/server";
import { calculateOrderTotal } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { packageId, promoCode } = await request.json();

    if (!packageId || typeof packageId !== "number") {
      return NextResponse.json(
        { ok: false, message: "Invalid package ID" },
        { status: 400 }
      );
    }

    const pricing = await calculateOrderTotal(packageId, promoCode || undefined);

    return NextResponse.json(
      {
        ok: true,
        message: "Promo validated",
        data: pricing,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Validation failed",
      },
      { status: 400 }
    );
  }
}
