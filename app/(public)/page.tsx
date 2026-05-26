import Hero from "@/components/Hero";
import Layanan from "@/components/Layanan";
import PacketSection from "@/components/PacketSection";
import TestimoniSection from "@/components/TestimoniSection";
import { prisma } from "@/lib/db";

const defaultHeroContent = {
  navbarPromoText: "PROMO 10% PER TANGGAL 25-27",
  heroTitle: "Sebisa Project",
  heroSubtitle: "We don't follow markets, we move them",
  heroCtaText: "Konsultasikan Sekarang",
  heroClientsText: "Dipercaya oleh 100+ client dari berbagai industri",
  heroBottomHeading:
    "Semua strategi dirancang khusus untuk kamu, kamu tinggal terima beres!",
  heroBottomText:
    "Konsultasikan kebutuhan kamu, dan kami akan tangani dan membantu sepenuh cinta dan kasih.",
  heroBottomButtonText: "Mulai Gratis Sekarang",
};

export default async function Home() {
  const [testimonials, trustedBrands, landingContent] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.trustedBrand.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.landingContent.findFirst(),
  ]);

  return (
    <div>
      <Hero
        trustedBrands={trustedBrands}
        heroContent={landingContent ?? defaultHeroContent}
      />
      <Layanan />
      <PacketSection />
      <TestimoniSection testimonials={testimonials} />
    </div>
  );
}
