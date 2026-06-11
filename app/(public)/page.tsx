import Hero from "@/components/Hero";
import ContactSection from "@/components/ContactSection";
import Layanan from "@/components/Layanan";
import PacketSection from "@/components/PacketSection";
import PortfolioSection from "@/components/PortfolioSection";
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
  const [testimonials, trustedBrands, portfolios, services, landingContent] =
    await Promise.all([
      prisma.testimonial.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.trustedBrand.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.portfolio.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          brand: true,
          image: true,
        },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
        select: {
          id: true,
          title: true,
          description: true,
        },
      }),
      prisma.landingContent.findFirst(),
    ]);

  return (
    <div>
      <Hero
        trustedBrands={trustedBrands}
        heroContent={landingContent ?? defaultHeroContent}
      />
      <Layanan services={services} />
      <PacketSection />
      <TestimoniSection testimonials={testimonials} />
      <PortfolioSection portfolios={portfolios} />
      <ContactSection />
    </div>
  );
}
