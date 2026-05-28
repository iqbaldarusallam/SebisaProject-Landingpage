DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Package" WHERE "name" = 'Paket Landing Page') THEN
    UPDATE "Package"
    SET
      "category" = 'website-development',
      "description" = 'Paket pembuatan landing page profesional untuk membantu brand menampilkan penawaran, produk, layanan, dan informasi bisnis secara lebih menarik serta mudah diakses oleh calon customer.',
      "price" = 3500000,
      "salePrice" = 2500000,
      "badgeType" = 'discount',
      "badgeText" = NULL,
      "duration" = '7-10 hari kerja',
      "features" = 'Briefing kebutuhan landing page
Mockup desain landing page
Revisi mockup desain
Develop landing page responsive
Integrasi WhatsApp
Integrasi payment gateway Midtrans
Optimasi tampilan mobile
Revisi landing page
Launching landing page hingga dapat diakses online',
      "popular" = false,
      "order" = 11,
      "updatedAt" = NOW()
    WHERE "name" = 'Paket Landing Page';
  ELSE
    INSERT INTO "Package" (
      "name",
      "category",
      "description",
      "price",
      "salePrice",
      "badgeType",
      "duration",
      "features",
      "popular",
      "order",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      'Paket Landing Page',
      'website-development',
      'Paket pembuatan landing page profesional untuk membantu brand menampilkan penawaran, produk, layanan, dan informasi bisnis secara lebih menarik serta mudah diakses oleh calon customer.',
      3500000,
      2500000,
      'discount',
      '7-10 hari kerja',
      'Briefing kebutuhan landing page
Mockup desain landing page
Revisi mockup desain
Develop landing page responsive
Integrasi WhatsApp
Integrasi payment gateway Midtrans
Optimasi tampilan mobile
Revisi landing page
Launching landing page hingga dapat diakses online',
      false,
      11,
      NOW(),
      NOW()
    );
  END IF;

  IF EXISTS (SELECT 1 FROM "Package" WHERE "name" = 'Paket Website') THEN
    UPDATE "Package"
    SET
      "category" = 'website-development',
      "description" = 'Paket pembuatan website profesional untuk membantu brand memiliki media digital yang lebih kredibel, informatif, dan mendukung kebutuhan transaksi online melalui integrasi payment gateway.',
      "price" = 5000000,
      "salePrice" = 3500000,
      "badgeType" = 'custom',
      "badgeText" = 'Best Choice',
      "duration" = '14-21 hari kerja',
      "features" = 'Briefing kebutuhan website
Mockup desain website
Revisi mockup desain
Develop website responsive
Integrasi WhatsApp
Integrasi payment gateway Midtrans
Optimasi tampilan mobile
Revisi website 1 & 2
Setup domain dan hosting
Launching website hingga dapat diakses online',
      "popular" = false,
      "order" = 12,
      "updatedAt" = NOW()
    WHERE "name" = 'Paket Website';
  ELSE
    INSERT INTO "Package" (
      "name",
      "category",
      "description",
      "price",
      "salePrice",
      "badgeType",
      "badgeText",
      "duration",
      "features",
      "popular",
      "order",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      'Paket Website',
      'website-development',
      'Paket pembuatan website profesional untuk membantu brand memiliki media digital yang lebih kredibel, informatif, dan mendukung kebutuhan transaksi online melalui integrasi payment gateway.',
      5000000,
      3500000,
      'custom',
      'Best Choice',
      '14-21 hari kerja',
      'Briefing kebutuhan website
Mockup desain website
Revisi mockup desain
Develop website responsive
Integrasi WhatsApp
Integrasi payment gateway Midtrans
Optimasi tampilan mobile
Revisi website 1 & 2
Setup domain dan hosting
Launching website hingga dapat diakses online',
      false,
      12,
      NOW(),
      NOW()
    );
  END IF;
END $$;
