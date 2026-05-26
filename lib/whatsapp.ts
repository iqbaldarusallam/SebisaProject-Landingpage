const WHATSAPP_NUMBER = "6283170943758";
const WHATSAPP_MESSAGE =
  "Halo Sebisa Project, saya ingin konsultasi layanan digital.";

type WhatsappConsultationData = {
  name?: string;
  brand?: string;
  product?: string;
  phone?: string;
};

export const WHATSAPP_CONSULTATION_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export function createWhatsappConsultationUrl({
  name,
  brand,
  product,
  phone,
}: WhatsappConsultationData) {
  const message = [
    "Halo Sebisa Project, saya ingin konsultasi untuk bisnis saya.",
    "",
    `Nama : ${name?.trim() || "-"}`,
    `Brand : ${brand?.trim() || "-"}`,
    `Produk : ${product?.trim() || "-"}`,
    `No Telepon : ${phone?.trim() || "-"}`,
    "",
    "Saya ingin konsultasi layanan digital yang cocok untuk kebutuhan bisnis saya.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
