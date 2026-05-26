CREATE TABLE IF NOT EXISTS "landing_contents" (
    "id" SERIAL NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Sebisa Project',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'We don''t follow markets, we move them',
    "heroCtaText" TEXT NOT NULL DEFAULT 'Konsultasikan Sekarang',
    "heroClientsText" TEXT NOT NULL DEFAULT 'Dipercaya oleh 100+ client dari berbagai industri',
    "packageSectionHeading" TEXT NOT NULL DEFAULT 'Paket Social Media Management',
    "packageSectionSubheading" TEXT NOT NULL DEFAULT 'Pilih paket sesuai dengan kebutuhan kamu!',
    "heroBottomHeading" TEXT NOT NULL DEFAULT 'Semua strategi dirancang khusus untuk kamu, kamu tinggal terima beres!',
    "heroBottomText" TEXT NOT NULL DEFAULT 'Konsultasikan kebutuhan kamu, dan kami akan tangani dan membantu sepenuh cinta dan kasih.',
    "heroBottomButtonText" TEXT NOT NULL DEFAULT 'Mulai Gratis Sekarang',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_contents_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "landing_contents" ADD COLUMN IF NOT EXISTS "navbarPromoText" TEXT NOT NULL DEFAULT 'PROMO 10% PER TANGGAL 25-27';
