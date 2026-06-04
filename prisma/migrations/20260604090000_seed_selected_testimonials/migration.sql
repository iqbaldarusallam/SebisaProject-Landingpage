DELETE FROM "Testimonial"
WHERE ("name" = 'Kopi Ruang Kota' AND "brand" = 'Food & Beverage')
   OR ("name" = 'Nusa Kreatif' AND "brand" = 'Creative Studio')
   OR ("name" = 'Aruna Skincare' AND "brand" = 'Beauty');

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Pak Ainur & Pak Taufik', 'Tour Travel Umroh Al Hasan', 'Website sesuai harapan, leads bisa masuk 5 jamaah dalam sebulan. Pengelolaan TikTok dan Instagram juga konsisten membangun awareness.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Pak Ainur & Pak Taufik' AND "brand" = 'Tour Travel Umroh Al Hasan'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Pak Saimin', 'Yu! Kebab', 'Foto produk sangat terpakai untuk menu dan media sosial di 4 outlet. Desain outletnya juga membuat kami puas.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Pak Saimin' AND "brand" = 'Yu! Kebab'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Pak Hartono', 'Rice Bran', 'Company profile yang dibuat membuat produk kami lebih siap dikenalkan ke instansi lain dan punya pondasi informasi yang jelas.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Pak Hartono' AND "brand" = 'Rice Bran'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Pak Lanin', 'Nasi Liwet Lavanda', 'Video company profile-nya keren dan membantu kami tampil lebih percaya diri sampai juara di kompetisi Bali.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Pak Lanin' AND "brand" = 'Nasi Liwet Lavanda'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Pak Megel', 'PT Wana Kencana Mineral', 'Video release yang dibuat membantu penyampaian isu kami lebih jelas, terarah, dan mendapat perhatian yang sesuai.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Pak Megel' AND "brand" = 'PT Wana Kencana Mineral'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Ibu Aisyah', 'Kebab Endul Frozen', 'Live streaming jadi lebih terarah, lebih ramai ditonton, dan optimasi Shopee membantu produk lebih terbaca algoritma.', 4, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Ibu Aisyah' AND "brand" = 'Kebab Endul Frozen'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Hj. Linda Maftuhah', 'Pondok Pesantren An-Najah', 'Media sosial dan website sekolah membantu aktivitas santri dan siswa lebih terekspos secara digital.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Hj. Linda Maftuhah' AND "brand" = 'Pondok Pesantren An-Najah'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Pak Mansur', 'Kapsul Herbalamb', 'Pengelolaan media jadi lebih rapi, dan testimoni produk membantu calon pembeli semakin yakin.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Pak Mansur' AND "brand" = 'Kapsul Herbalamb'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Kak Kiki Chandra', 'Jakarta Garden City', 'Konten vlog yang dibuat terasa relatable, sesuai target pasar, dan berhasil membantu kami meraih beberapa juara.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Kak Kiki Chandra' AND "brand" = 'Jakarta Garden City'
);

INSERT INTO "Testimonial" ("name", "brand", "content", "rating", "createdAt", "updatedAt")
SELECT 'Pak Basuni', 'PT Bina Auto Solusi', 'Arahan creative video dan strategi marketing sangat membantu penjualan online meningkat sampai omzet bulanan melonjak.', 5, NOW(), NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial" WHERE "name" = 'Pak Basuni' AND "brand" = 'PT Bina Auto Solusi'
);
