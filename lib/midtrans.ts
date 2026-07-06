import "server-only";

import { createHash } from "crypto";
import { Snap } from "midtrans-client";

const isProduction = true;
const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

if (!serverKey) {
  throw new Error("MIDTRANS_SERVER_KEY is not configured");
}

const snap = new Snap({
  isProduction,
  serverKey,
  clientKey: clientKey ?? "",
}) as Snap & {
  transaction: {
    status(orderId: string): Promise<unknown>;
  };
};

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
  notification_url?: string;
  finish_redirect_url?: string;
  callbacks?: {
    finish?: string;
  };
}

export function getMidtransConfig() {
  return {
    isProduction,
    hasServerKey: Boolean(serverKey),
    hasClientKey: Boolean(clientKey),
  };
}

export async function createMidtransTransaction(
  transaction: MidtransTransaction,
) {
  const response = await snap.createTransaction(transaction);
  return response.token;
}

export async function getMidtransStatus(orderId: string) {
  return snap.transaction.status(orderId);
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signature: string,
): boolean {
  if (!serverKey) {
    return false;
  }

  const hash = createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");

  return hash === signature;
}

export function sanitizeMidtransLog<T>(value: T): T {
  if (!value || typeof value !== "object") return value;

  const sensitiveKeys = new Set([
    "serverKey",
    "clientKey",
    "signature_key",
    "signatureKey",
    "token",
    "redirect_url",
    "redirectUrl",
  ]);

  return JSON.parse(
    JSON.stringify(value, (key, currentValue) => {
      if (sensitiveKeys.has(key)) return "[redacted]";
      return currentValue;
    }),
  ) as T;
}
