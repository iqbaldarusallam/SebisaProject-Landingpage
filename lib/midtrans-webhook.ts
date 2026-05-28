import { prisma } from "@/lib/db";
import { verifyMidtransSignature } from "@/lib/midtrans";

type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
};

function getOrderStatus(notification: MidtransNotification) {
  const transactionStatus = notification.transaction_status;
  const fraudStatus = notification.fraud_status;

  if (transactionStatus === "capture") {
    return fraudStatus === "challenge" ? "pending" : "paid";
  }

  if (transactionStatus === "settlement") {
    return "paid";
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

export async function processMidtransWebhook(body: unknown) {
  const notification = body as MidtransNotification;
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

  const order = await prisma.order.findFirst({
    where: { transactionId: order_id },
  });

  if (!order) {
    return {
      status: 404,
      response: { ok: false, message: "Order not found" },
    };
  }

  const previousStatus = order.status;
  const newStatus = getOrderStatus(notification);

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status: newStatus },
  });

  if (newStatus === "paid" && previousStatus !== "paid" && order.promoId) {
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
