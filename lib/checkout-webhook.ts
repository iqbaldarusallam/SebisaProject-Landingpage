import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  getMidtransStatus,
  sanitizeMidtransLog,
  verifyMidtransSignature,
} from "@/lib/midtrans";

type MidtransNotificationPayload = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  transaction_id?: string;
  payment_type?: string;
  currency?: string;
  transaction_time?: string;
  settlement_time?: string;
};

type CheckoutOrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refunded"
  | "partial_refunded"
  | "canceled";

type NormalizedMidtransNotification = {
  orderId: string;
  statusCode: string;
  grossAmount: number;
  grossAmountText: string;
  signatureKey: string;
  transactionStatus: string;
  fraudStatus: string | null;
  transactionId: string;
  paymentType: string;
  currency: string;
  transactionTime: Date | null;
  settlementTime: Date | null;
};

function parseAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeNotification(
  notification: MidtransNotificationPayload,
): NormalizedMidtransNotification | null {
  const orderId = notification.order_id?.trim();
  const statusCode = notification.status_code?.trim();
  const grossAmountText = notification.gross_amount?.trim();
  const grossAmount = grossAmountText ? parseAmount(grossAmountText) : null;
  const signatureKey = notification.signature_key?.trim();
  const transactionStatus = notification.transaction_status?.trim();

  if (
    !orderId ||
    !statusCode ||
    !grossAmountText ||
    grossAmount === null ||
    !signatureKey ||
    !transactionStatus
  ) {
    return null;
  }

  return {
    orderId,
    statusCode,
    grossAmount,
    grossAmountText,
    signatureKey,
    transactionStatus,
    fraudStatus: notification.fraud_status?.trim() || null,
    transactionId: notification.transaction_id?.trim() || orderId,
    paymentType: notification.payment_type?.trim() || "unknown",
    currency: notification.currency?.trim() || "IDR",
    transactionTime: parseDate(notification.transaction_time),
    settlementTime: parseDate(notification.settlement_time),
  };
}

function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus: string | null,
): CheckoutOrderStatus {
  const unsafeFraudStatus = fraudStatus && fraudStatus !== "accept";

  switch (transactionStatus) {
    case "settlement":
      return unsafeFraudStatus ? "failed" : "paid";
    case "capture":
      return fraudStatus === "accept"
        ? "paid"
        : fraudStatus === "challenge"
          ? "pending"
          : "failed";
    case "pending":
      return "pending";
    case "deny":
      return "failed";
    case "cancel":
      return "canceled";
    case "expire":
      return "expired";
    case "failure":
      return "failed";
    case "refund":
      return "refunded";
    case "partial_refund":
      return "partial_refunded";
    default:
      return "pending";
  }
}

function shouldIgnoreStatusUpdate(previousStatus: string, nextStatus: CheckoutOrderStatus) {
  if (previousStatus === "paid" && nextStatus === "pending") return true;
  if (previousStatus === "paid" && nextStatus === "canceled") return true;
  if (previousStatus === "paid" && nextStatus === "failed") return true;
  if (previousStatus === "refunded" && nextStatus !== "refunded" && nextStatus !== "partial_refunded") {
    return true;
  }
  if (previousStatus === "partial_refunded" && nextStatus === "pending") return true;
  return false;
}

async function recordPaymentEvent(params: {
  orderId: number;
  normalized: NormalizedMidtransNotification;
  signatureVerified: boolean | null;
  amountVerified: boolean;
  verificationSource: string;
  rawWebhook: Prisma.InputJsonValue;
}) {
  await prisma.midtransPaymentEvent.createMany({
    data: [
      {
        orderId: params.orderId,
        midtransOrderId: params.normalized.orderId,
        midtransTransactionId: params.normalized.transactionId,
        paymentType: params.normalized.paymentType,
        transactionStatus: params.normalized.transactionStatus,
        fraudStatus: params.normalized.fraudStatus ?? "unknown",
        grossAmount: params.normalized.grossAmount,
        currency: params.normalized.currency,
        transactionTime: params.normalized.transactionTime,
        settlementTime: params.normalized.settlementTime,
        signatureVerified: params.signatureVerified,
        amountVerified: params.amountVerified,
        verificationSource: params.verificationSource,
        rawWebhook: params.rawWebhook,
      },
    ],
    skipDuplicates: true,
  });
}

async function syncOrderFromNotification(params: {
  orderId: number;
  nextStatus: CheckoutOrderStatus;
  normalized: NormalizedMidtransNotification;
  signatureVerified: boolean | null;
  amountVerified: boolean;
  rawWebhook: Prisma.InputJsonValue;
}) {
  await prisma.$transaction(async (tx) => {
    const data = {
      status: params.nextStatus,
      paymentType: params.normalized.paymentType,
      midtransTransactionId: params.normalized.transactionId,
      midtransTransactionStatus: params.normalized.transactionStatus,
      midtransFraudStatus: params.normalized.fraudStatus,
      midtransGrossAmount: params.normalized.grossAmount,
      midtransCurrency: params.normalized.currency,
      midtransTransactionTime: params.normalized.transactionTime,
      midtransSettlementTime: params.normalized.settlementTime,
      midtransSignatureVerified: params.signatureVerified,
      midtransLastSyncedAt: new Date(),
    };

    if (params.nextStatus === "paid") {
      const updateResult = await tx.order.updateMany({
        where: { id: params.orderId, status: { not: "paid" } },
        data,
      });

      if (updateResult.count > 0) {
        const order = await tx.order.findUnique({
          where: { id: params.orderId },
          select: { promoId: true },
        });

        if (order?.promoId) {
          await tx.promo.update({
            where: { id: order.promoId },
            data: { currentUsage: { increment: 1 } },
          });
        }
      }

      return;
    }

    await tx.order.update({
      where: { id: params.orderId },
      data,
    });
  });

  await recordPaymentEvent({
    orderId: params.orderId,
    normalized: params.normalized,
    signatureVerified: params.signatureVerified,
    amountVerified: params.amountVerified,
    verificationSource: "webhook",
    rawWebhook: params.rawWebhook,
  });
}

function logNotificationEvent(params: {
  orderId: string;
  statusCode: string;
  transactionStatus: string;
  fraudStatus: string | null;
  grossAmount: number;
  signatureVerified: boolean;
  amountVerified: boolean;
  result: string;
}) {
  console.log("[midtrans-webhook]", {
    orderId: params.orderId,
    statusCode: params.statusCode,
    transactionStatus: params.transactionStatus,
    fraudStatus: params.fraudStatus,
    grossAmount: params.grossAmount,
    signatureVerified: params.signatureVerified,
    amountVerified: params.amountVerified,
    result: params.result,
  });
}

export async function processCheckoutWebhook(body: unknown) {
  const notification = body as MidtransNotificationPayload;
  const normalized = normalizeNotification(notification);

  if (!normalized) {
    logNotificationEvent({
      orderId: String(notification.order_id ?? "unknown"),
      statusCode: String(notification.status_code ?? "unknown"),
      transactionStatus: String(notification.transaction_status ?? "unknown"),
      fraudStatus: notification.fraud_status ?? null,
      grossAmount: NaN,
      signatureVerified: false,
      amountVerified: false,
      result: "rejected_incomplete_payload",
    });

    return {
      status: 400,
      response: { ok: false, message: "Incomplete Midtrans notification" },
    };
  }

  const signatureVerified = verifyMidtransSignature(
    normalized.orderId,
    normalized.statusCode,
    normalized.grossAmountText,
    normalized.signatureKey,
  );

  if (!signatureVerified) {
    logNotificationEvent({
      orderId: normalized.orderId,
      statusCode: normalized.statusCode,
      transactionStatus: normalized.transactionStatus,
      fraudStatus: normalized.fraudStatus,
      grossAmount: normalized.grossAmount,
      signatureVerified: false,
      amountVerified: false,
      result: "rejected_invalid_signature",
    });

    return {
      status: 401,
      response: { ok: false, message: "Invalid signature" },
    };
  }

  const order = await prisma.order.findFirst({
    where: { transactionId: normalized.orderId },
  });

  if (!order) {
    logNotificationEvent({
      orderId: normalized.orderId,
      statusCode: normalized.statusCode,
      transactionStatus: normalized.transactionStatus,
      fraudStatus: normalized.fraudStatus,
      grossAmount: normalized.grossAmount,
      signatureVerified: true,
      amountVerified: false,
      result: "ignored_order_not_found",
    });

    return {
      status: 200,
      response: { ok: true, message: "Order not found, notification ignored" },
    };
  }

  const amountVerified = Math.round(order.totalPrice) === normalized.grossAmount;

  if (!amountVerified) {
    logNotificationEvent({
      orderId: normalized.orderId,
      statusCode: normalized.statusCode,
      transactionStatus: normalized.transactionStatus,
      fraudStatus: normalized.fraudStatus,
      grossAmount: normalized.grossAmount,
      signatureVerified: true,
      amountVerified: false,
      result: "rejected_amount_mismatch",
    });

    await recordPaymentEvent({
      orderId: order.id,
      normalized,
      signatureVerified,
      amountVerified,
      verificationSource: "webhook",
      rawWebhook: body as Prisma.InputJsonValue,
    });

    return {
      status: 400,
      response: { ok: false, message: "Gross amount mismatch" },
    };
  }

  const nextStatus = mapMidtransStatus(normalized.transactionStatus, normalized.fraudStatus);
  const previousStatus = order.status;

  if (shouldIgnoreStatusUpdate(previousStatus, nextStatus)) {
    logNotificationEvent({
      orderId: normalized.orderId,
      statusCode: normalized.statusCode,
      transactionStatus: normalized.transactionStatus,
      fraudStatus: normalized.fraudStatus,
      grossAmount: normalized.grossAmount,
      signatureVerified: true,
      amountVerified: true,
      result: "accepted_ignored_status_unchanged",
    });

    await recordPaymentEvent({
      orderId: order.id,
      normalized,
      signatureVerified,
      amountVerified,
      verificationSource: "webhook",
      rawWebhook: body as Prisma.InputJsonValue,
    });

    return {
      status: 200,
      response: {
        ok: true,
        message: "Notification received without status change",
      },
    };
  }

  await syncOrderFromNotification({
    orderId: order.id,
    nextStatus,
    normalized,
    signatureVerified,
    amountVerified,
    rawWebhook: body as Prisma.InputJsonValue,
  });

  logNotificationEvent({
    orderId: normalized.orderId,
    statusCode: normalized.statusCode,
    transactionStatus: normalized.transactionStatus,
    fraudStatus: normalized.fraudStatus,
    grossAmount: normalized.grossAmount,
    signatureVerified: true,
    amountVerified: true,
    result: `accepted_status_changed_to_${nextStatus}`,
  });

  return {
    status: 200,
    response: {
      ok: true,
      message: "Payment processed",
      data: {
        orderId: order.id,
        transactionId: normalized.transactionId,
        status: nextStatus,
      },
    },
  };
}

export async function reconcileCheckoutStatus(orderId: string) {
  const order = await prisma.order.findFirst({
    where: { transactionId: orderId },
  });

  if (!order) {
    return { ok: false as const, message: "Order not found" };
  }

  const rawStatus = (await getMidtransStatus(orderId)) as Record<string, unknown>;
  const transactionStatus = String(rawStatus.transaction_status ?? "");
  const fraudStatus = rawStatus.fraud_status ? String(rawStatus.fraud_status) : null;
  const grossAmount = Number(rawStatus.gross_amount ?? order.totalPrice);
  const amountVerified = Math.round(order.totalPrice) === grossAmount;
  const nextStatus = mapMidtransStatus(transactionStatus, fraudStatus);

  if (amountVerified && nextStatus !== order.status) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        paymentType: String(rawStatus.payment_type ?? order.paymentType ?? "unknown"),
        midtransTransactionId: String(rawStatus.transaction_id ?? order.midtransTransactionId ?? order.transactionId ?? orderId),
        midtransTransactionStatus: transactionStatus || order.midtransTransactionStatus,
        midtransFraudStatus: fraudStatus ?? order.midtransFraudStatus,
        midtransGrossAmount: grossAmount,
        midtransCurrency: String(rawStatus.currency ?? order.midtransCurrency ?? "IDR"),
        midtransTransactionTime: parseDate(String(rawStatus.transaction_time ?? "")) ?? order.midtransTransactionTime,
        midtransSettlementTime: parseDate(String(rawStatus.settlement_time ?? "")) ?? order.midtransSettlementTime,
        midtransSignatureVerified: null,
        midtransLastSyncedAt: new Date(),
      },
    });
  }

  await recordPaymentEvent({
    orderId: order.id,
    normalized: {
      orderId,
      statusCode: String(rawStatus.status_code ?? "200"),
      grossAmount: Number.isFinite(grossAmount) ? grossAmount : Math.round(order.totalPrice),
      grossAmountText: String(rawStatus.gross_amount ?? Math.round(order.totalPrice)),
      signatureKey: "status-api",
      transactionStatus: transactionStatus || "unknown",
      fraudStatus,
      transactionId: String(rawStatus.transaction_id ?? order.midtransTransactionId ?? order.transactionId ?? orderId),
      paymentType: String(rawStatus.payment_type ?? order.paymentType ?? "unknown"),
      currency: String(rawStatus.currency ?? order.midtransCurrency ?? "IDR"),
      transactionTime: parseDate(String(rawStatus.transaction_time ?? "")),
      settlementTime: parseDate(String(rawStatus.settlement_time ?? "")),
    },
    signatureVerified: null,
    amountVerified,
    verificationSource: "status_api",
    rawWebhook: sanitizeMidtransLog(rawStatus) as Prisma.InputJsonValue,
  });

  return {
    ok: true as const,
    status: amountVerified ? nextStatus : order.status,
  };
}
