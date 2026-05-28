import { prisma } from "@/lib/db";
import { verifyMidtransSignature } from "@/lib/midtrans";

type MidtransNotificationPayload = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
};

type CheckoutOrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refunded";

function mapMidtransStatus(
  notification: MidtransNotificationPayload,
): CheckoutOrderStatus {
  const transactionStatus = notification.transaction_status;
  const fraudStatus = notification.fraud_status;
  const statusCode = notification.status_code;

  if (transactionStatus === "capture") {
    if (fraudStatus === "challenge") return "pending";
    if (fraudStatus === "deny") return "failed";
    return statusCode === "200" ? "paid" : "pending";
  }

  if (transactionStatus === "settlement") {
    return statusCode === "200" ? "paid" : "pending";
  }

  if (
    transactionStatus === "deny" ||
    transactionStatus === "cancel" ||
    transactionStatus === "failure"
  ) {
    return "failed";
  }

  if (transactionStatus === "expire") {
    return "expired";
  }

  if (transactionStatus === "refund" || transactionStatus === "partial_refund") {
    return "refunded";
  }

  return "pending";
}

function isMidtransTestNotification(orderId: string) {
  return orderId.toLowerCase().includes("payment_notif_test");
}

function shouldIgnoreStatusUpdate(
  previousStatus: string,
  nextStatus: CheckoutOrderStatus,
) {
  if (previousStatus === "paid" && nextStatus === "pending") {
    return true;
  }

  if (previousStatus === "refunded" && nextStatus !== "refunded") {
    return true;
  }

  return false;
}

export async function processCheckoutWebhook(body: unknown) {
  const notification = body as MidtransNotificationPayload;
  const { order_id, status_code, gross_amount, signature_key } = notification;

  if (!order_id || !status_code || !gross_amount || !signature_key) {
    return {
      status: 400,
      response: { ok: false, message: "Incomplete Midtrans notification" },
    };
  }

  const isValid = verifyMidtransSignature(
    order_id,
    status_code,
    gross_amount,
    signature_key,
  );

  if (!isValid) {
    return {
      status: 401,
      response: { ok: false, message: "Invalid signature" },
    };
  }

  // Wajib taruh test notification sebelum lookup order supaya test dari
  // dashboard Midtrans tidak gagal karena order dummy tidak ada di database.
  if (isMidtransTestNotification(order_id)) {
    return {
      status: 200,
      response: {
        ok: true,
        message: "Midtrans test notification received",
      },
    };
  }

  const order = await prisma.order.findFirst({
    where: { transactionId: order_id },
  });

  if (!order) {
    return {
      status: 200,
      response: { ok: true, message: "Order not found, notification ignored" },
    };
  }

  const previousStatus = order.status;
  const nextStatus = mapMidtransStatus(notification);

  if (shouldIgnoreStatusUpdate(previousStatus, nextStatus)) {
    return {
      status: 200,
      response: {
        ok: true,
        message: "Notification received without status change",
      },
    };
  }

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: nextStatus },
  });

  if (nextStatus === "paid" && previousStatus !== "paid" && order.promoId) {
    await prisma.promo.update({
      where: { id: order.promoId },
      data: { currentUsage: { increment: 1 } },
    });
  }

  return {
    status: 200,
    response: {
      ok: true,
      message: "Payment processed",
      data: updatedOrder,
    },
  };
}
