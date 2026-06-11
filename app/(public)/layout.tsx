import Footer from "@/components/Footer";
import MidtransSnapScript from "@/components/MidtransSnapScript";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/db";
import { expireEndedPromos } from "@/lib/promo-expiration";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const now = new Date();
  await expireEndedPromos(now);

  const [activePromo, landingContent] = await Promise.all([
    prisma.promo.findFirst({
      where: {
        isActive: true,
        showCountdown: true,
        code: { not: { startsWith: "AUTO-" } },
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "desc" },
    }),
    prisma.landingContent.findFirst(),
  ]);

  return (
    <>
      <MidtransSnapScript />
      <Navbar
        promo={activePromo ?? undefined}
        promoText={
          landingContent?.navbarPromoText ?? "PROMO 10% PER TANGGAL 25-27"
        }
      />
      <main className="flex min-h-screen flex-col">{children}</main>
      <Footer />
    </>
  );
}
