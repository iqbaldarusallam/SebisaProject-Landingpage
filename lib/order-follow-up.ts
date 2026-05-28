type FollowUpOrder = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  package?: {
    name?: string | null;
  } | null;
};

export function normalizeWhatsappPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export function createOrderFollowUpWhatsappUrl(order: FollowUpOrder) {
  if (order.status !== "pending" && order.status !== "expired") return null;

  const phone = normalizeWhatsappPhone(order.customerPhone);
  if (!phone) return null;

  const statusLabel = order.status === "pending" ? "Pending" : "Expired";
  const message =
    order.status === "pending"
      ? [
          `Halo Kak ${order.customerName}, kami dari Sebisa Project ingin menginformasikan bahwa pesanan Kakak masih berstatus pending.`,
          "",
          "Detail pesanan:",
          `Nama: ${order.customerName}`,
          `Email: ${order.customerEmail}`,
          `Paket: ${order.package?.name ?? "-"}`,
          `Status Pembayaran: ${statusLabel}`,
          "",
          "Mohon segera menyelesaikan pembayaran agar pesanan dapat kami proses. Jika Kakak mengalami kendala saat pembayaran, silakan balas pesan ini ya. Terima kasih.",
        ].join("\n")
      : [
          `Halo Kak ${order.customerName}, kami dari Sebisa Project ingin menginformasikan bahwa pesanan Kakak sudah berstatus expired karena pembayaran belum diselesaikan dalam batas waktu yang tersedia.`,
          "",
          "Detail pesanan:",
          `Nama: ${order.customerName}`,
          `Email: ${order.customerEmail}`,
          `Paket: ${order.package?.name ?? "-"}`,
          `Status Pembayaran: ${statusLabel}`,
          "",
          "Jika Kakak masih ingin melanjutkan pesanan ini, silakan balas pesan ini agar kami bantu arahkan untuk melakukan pemesanan ulang. Terima kasih.",
        ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
