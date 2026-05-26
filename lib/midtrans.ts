import midtransClient from "midtrans-client";
import { createHash } from "crypto";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
});

export interface MidtransTransaction {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details: {
    email: string;
    phone: string;
    first_name: string;
  };
  item_details?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  callbacks?: {
    finish?: string;
  };
}

export async function createMidtransTransaction(
  transaction: MidtransTransaction,
) {
  try {
    if (!process.env.MIDTRANS_SERVER_KEY) {
      throw new Error("MIDTRANS_SERVER_KEY is not configured");
    }

    const token = await snap.createTransactionToken(transaction);
    return token;
  } catch (error) {
    console.error("Midtrans error:", error);
    throw error;
  }
}

export async function getMidtransStatus(orderId: string) {
  try {
    const status = await snap.transaction.status(orderId);
    return status;
  } catch (error) {
    console.error("Midtrans status error:", error);
    throw error;
  }
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signature: string,
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    return false;
  }

  const hash = createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");

  return hash === signature;
}
