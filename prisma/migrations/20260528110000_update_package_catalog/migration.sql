WITH desired_packages (
  display_order,
  name,
  category,
  description,
  normal_price,
  promo_price,
  badge,
  duration,
  features
) AS (
  VALUES
    (
      1,
      'Paket Starter',
      'social-media-management',
      'Benefit untuk brand kamu',
      700000::DOUBLE PRECISION,
      399000::DOUBLE PRECISION,
      'Hemat',
      '1 bulan',
      '10 Design Graphic
Content Research
Copywriting & Captions
Minor Revision'
    ),
    (
      2,
      'Paket Kreator',
      'social-media-management',
      'Benefit untuk brand kamu',
      5000000::DOUBLE PRECISION,
      3500000::DOUBLE PRECISION,
      'Populer',
      '1 bulan',
      '5 Video Content
2 Catalog / Carousel
Foto Produk + Shooting Video
1 Talent Video
Editing & Revisions'
    ),
    (
      3,
      'Paket Pro',
      'social-media-management',
      'Benefit untuk brand kamu',
      7000000::DOUBLE PRECISION,
      4300000::DOUBLE PRECISION,
      'Hemat',
      '1 bulan',
      '7 Video Content
3 Catalog / Carousel
Admin Posting
2 Talent Video
5 Still Image
Foto Produk + Shoot'
    ),
    (
      4,
      'Paket Elite',
      'social-media-management',
      'Benefit untuk brand kamu',
      9500000::DOUBLE PRECISION,
      5680000::DOUBLE PRECISION,
      'Hemat',
      '1 bulan',
      '9 Video Content
5 Catalog / Carousel
10 Still Image
2 Talent Video
Admin Posting
Foto Produk + Shoot'
    ),
    (
      5,
      'Social Media Jalan Terus',
      'social-media-management',
      'Benefit untuk brand kamu',
      NULL::DOUBLE PRECISION,
      300000::DOUBLE PRECISION,
      'Mulai dari 300.000',
      '1 bulan',
      'Feed Instagram tertata & rapi
Tim kreatif profesional untuk brand kamu
Video reels menarik
Caption & hashtag
Tinggal terima beres no report'
    ),
    (
      6,
      'Paket Konten Terima Beres',
      'social-media-management',
      'Benefit untuk brand kamu',
      NULL::DOUBLE PRECISION,
      299000::DOUBLE PRECISION,
      'Mulai dari 299.000',
      '1 bulan',
      'Research Content
Content Plan
Copywriting'
    ),
    (
      7,
      'Edit Set A',
      'social-media-management',
      'Benefit untuk brand kamu',
      NULL::DOUBLE PRECISION,
      300000::DOUBLE PRECISION,
      'Edit Set A',
      'Pengerjaan 3-5 Hari',
      '2 Video Editing Reels / TikTok
Include Shoot Video'
    ),
    (
      8,
      'Edit Set B',
      'social-media-management',
      'Benefit untuk brand kamu',
      NULL::DOUBLE PRECISION,
      400000::DOUBLE PRECISION,
      'Edit Set B',
      'Pengerjaan 4-5 Hari',
      '3 Video untuk Reels / TikTok
Include Shoot Video'
    ),
    (
      9,
      'Design Graphic Set A',
      'graphic-design',
      'Benefit untuk brand kamu',
      NULL::DOUBLE PRECISION,
      99000::DOUBLE PRECISION,
      'Design Graphic Set A',
      'Pengerjaan 1-2 Hari',
      '2 Design Graphic
Instagram Feed / Story
Include Foto Produk'
    ),
    (
      10,
      'Design Graphic Set B',
      'graphic-design',
      'Benefit untuk brand kamu',
      NULL::DOUBLE PRECISION,
      130000::DOUBLE PRECISION,
      'Design Graphic Set B',
      'Pengerjaan 1-2 Hari',
      '4 Design Graphic
Instagram Feed / Story
Include Foto Produk'
    )
),
normalized_packages AS (
  SELECT
    display_order,
    name,
    category,
    description,
    COALESCE(normal_price, promo_price) AS price,
    CASE
      WHEN normal_price IS NULL THEN NULL
      ELSE promo_price
    END AS sale_price,
    CASE
      WHEN badge = 'Populer' THEN TRUE
      ELSE FALSE
    END AS popular,
    CASE
      WHEN badge = 'Populer' THEN 'popular'
      WHEN badge = 'Hemat' THEN 'discount'
      ELSE 'custom'
    END AS badge_type,
    CASE
      WHEN badge IN ('Populer', 'Hemat') THEN NULL
      ELSE badge
    END AS badge_text,
    duration,
    features
  FROM desired_packages
),
updated_packages AS (
  UPDATE "Package"
  SET
    "name" = normalized_packages.name,
    "category" = normalized_packages.category,
    "description" = normalized_packages.description,
    "price" = normalized_packages.price,
    "salePrice" = normalized_packages.sale_price,
    "duration" = normalized_packages.duration,
    "features" = normalized_packages.features,
    "popular" = normalized_packages.popular,
    "badgeType" = normalized_packages.badge_type,
    "badgeText" = normalized_packages.badge_text,
    "order" = normalized_packages.display_order,
    "updatedAt" = NOW()
  FROM normalized_packages
  WHERE "Package"."order" = normalized_packages.display_order
  RETURNING "Package"."order"
)
INSERT INTO "Package" (
  "name",
  "category",
  "description",
  "price",
  "salePrice",
  "duration",
  "features",
  "popular",
  "badgeType",
  "badgeText",
  "order",
  "createdAt",
  "updatedAt"
)
SELECT
  normalized_packages.name,
  normalized_packages.category,
  normalized_packages.description,
  normalized_packages.price,
  normalized_packages.sale_price,
  normalized_packages.duration,
  normalized_packages.features,
  normalized_packages.popular,
  normalized_packages.badge_type,
  normalized_packages.badge_text,
  normalized_packages.display_order,
  NOW(),
  NOW()
FROM normalized_packages
WHERE NOT EXISTS (
  SELECT 1
  FROM updated_packages
  WHERE updated_packages."order" = normalized_packages.display_order
);
