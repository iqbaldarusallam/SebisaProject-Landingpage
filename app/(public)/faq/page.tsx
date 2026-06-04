import type { Metadata } from "next";
import FAQPageContent from "@/components/FAQPageContent";

export const metadata: Metadata = {
  title: "FAQ | Sebisa Project",
  description:
    "Pertanyaan yang sering ditanyakan tentang layanan, proses kerja sama, pembayaran, dan konsultasi Sebisa Project.",
};

export default function FAQPage() {
  return <FAQPageContent />;
}
