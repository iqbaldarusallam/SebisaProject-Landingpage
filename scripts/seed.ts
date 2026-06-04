import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@sebisa.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcryptjs.hash(adminPassword, 10);
      await prisma.admin.create({
        data: {
          email: adminEmail,
          name: "Admin Sebisa",
          password: hashedPassword,
          role: adminEmail === "admin@sebisa.com" ? "super_admin" : "admin",
        },
      });
      console.log("Admin user created");
    } else {
      if (
        existingAdmin.email === "admin@sebisa.com" &&
        existingAdmin.role !== "super_admin"
      ) {
        await prisma.admin.update({
          where: { email: "admin@sebisa.com" },
          data: { role: "super_admin" },
        });
        console.log("Admin user promoted to super_admin");
      }
      console.log("Admin user already exists");
    }

    const landingContentData = {
      navbarPromoText: "PROMO 10% PER TANGGAL 25-27",
      heroTitle: "Sebisa Project",
      heroSubtitle:
        "Landing page, iklan digital, dan payment gateway yang dirancang untuk menaikkan konversi bisnis kamu.",
      heroCtaText: "Konsultasi Gratis",
      heroClientsText:
        "Dipercaya oleh brand lokal, UMKM, dan bisnis jasa dari berbagai industri",
      heroBottomHeading:
        "Semua strategi dirancang khusus untuk kamu, kamu tinggal terima beres!",
      heroBottomText:
        "Mulai dari copywriting, desain, tracking, sampai checkout Midtrans bisa dikelola dari satu sistem.",
      heroBottomButtonText: "Mulai Konsultasi",
    };

    const landingContent = await prisma.landingContent.findFirst();
    if (landingContent) {
      await prisma.landingContent.update({
        where: { id: landingContent.id },
        data: landingContentData,
      });
      console.log("Landing content updated");
    } else {
      await prisma.landingContent.create({ data: landingContentData });
      console.log("Landing content created");
    }

    const packages = await prisma.package.findMany();
    if (packages.length === 0) {
      await prisma.package.createMany({
        data: [
          {
            name: "Paket Starter",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 700000,
            salePrice: 399000,
            duration: "1 bulan",
            features: [
              "10 Design Graphic",
              "Content Research",
              "Copywriting & Captions",
              "Minor Revision",
            ].join("\n"),
            badgeType: "discount",
            order: 1,
          },
          {
            name: "Paket Kreator",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 5000000,
            salePrice: 3500000,
            duration: "1 bulan",
            features: [
              "5 Video Content",
              "2 Catalog / Carousel",
              "Foto Produk + Shooting Video",
              "1 Talent Video",
              "Editing & Revisions",
            ].join("\n"),
            popular: true,
            badgeType: "popular",
            order: 2,
          },
          {
            name: "Paket Pro",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 7000000,
            salePrice: 4300000,
            duration: "1 bulan",
            features: [
              "7 Video Content",
              "3 Catalog / Carousel",
              "Admin Posting",
              "2 Talent Video",
              "5 Still Image",
              "Foto Produk + Shoot",
            ].join("\n"),
            badgeType: "discount",
            order: 3,
          },
          {
            name: "Paket Elite",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 9500000,
            salePrice: 5680000,
            duration: "1 bulan",
            features: [
              "9 Video Content",
              "5 Catalog / Carousel",
              "10 Still Image",
              "2 Talent Video",
              "Admin Posting",
              "Foto Produk + Shoot",
            ].join("\n"),
            badgeType: "discount",
            order: 4,
          },
          {
            name: "Social Media Jalan Terus",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 300000,
            duration: "1 bulan",
            features: [
              "Feed Instagram tertata & rapi",
              "Tim kreatif profesional untuk brand kamu",
              "Video reels menarik",
              "Caption & hashtag",
              "Tinggal terima beres no report",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Mulai dari 300.000",
            order: 5,
          },
          {
            name: "Paket Konten Terima Beres",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 299000,
            duration: "1 bulan",
            features: [
              "Research Content",
              "Content Plan",
              "Copywriting",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Mulai dari 299.000",
            order: 6,
          },
          {
            name: "Edit Set A",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 300000,
            duration: "Pengerjaan 3-5 Hari",
            features: [
              "2 Video Editing Reels / TikTok",
              "Include Shoot Video",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Edit Set A",
            order: 7,
          },
          {
            name: "Edit Set B",
            category: "social-media-management",
            description: "Benefit untuk brand kamu",
            price: 400000,
            duration: "Pengerjaan 4-5 Hari",
            features: [
              "3 Video untuk Reels / TikTok",
              "Include Shoot Video",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Edit Set B",
            order: 8,
          },
          {
            name: "Design Graphic Set A",
            category: "graphic-design",
            description: "Benefit untuk brand kamu",
            price: 99000,
            duration: "Pengerjaan 1-2 Hari",
            features: [
              "2 Design Graphic",
              "Instagram Feed / Story",
              "Include Foto Produk",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Design Graphic Set A",
            order: 9,
          },
          {
            name: "Design Graphic Set B",
            category: "graphic-design",
            description: "Benefit untuk brand kamu",
            price: 130000,
            duration: "Pengerjaan 1-2 Hari",
            features: [
              "4 Design Graphic",
              "Instagram Feed / Story",
              "Include Foto Produk",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Design Graphic Set B",
            order: 10,
          },
          {
            name: "Paket Landing Page",
            category: "website-development",
            description:
              "Paket pembuatan landing page profesional untuk membantu brand menampilkan penawaran, produk, layanan, dan informasi bisnis secara lebih menarik serta mudah diakses oleh calon customer.",
            price: 3500000,
            salePrice: 2500000,
            duration: "7-10 hari kerja",
            features: [
              "Briefing kebutuhan landing page",
              "Mockup desain landing page",
              "Revisi mockup desain",
              "Develop landing page responsive",
              "Integrasi WhatsApp",
              "Integrasi payment gateway Midtrans",
              "Optimasi tampilan mobile",
              "Revisi landing page",
              "Launching landing page hingga dapat diakses online",
            ].join("\n"),
            badgeType: "discount",
            order: 11,
          },
          {
            name: "Paket Website",
            category: "website-development",
            description:
              "Paket pembuatan website profesional untuk membantu brand memiliki media digital yang lebih kredibel, informatif, dan mendukung kebutuhan transaksi online melalui integrasi payment gateway.",
            price: 5000000,
            salePrice: 3500000,
            duration: "14-21 hari kerja",
            features: [
              "Briefing kebutuhan website",
              "Mockup desain website",
              "Revisi mockup desain",
              "Develop website responsive",
              "Integrasi WhatsApp",
              "Integrasi payment gateway Midtrans",
              "Optimasi tampilan mobile",
              "Revisi website 1 & 2",
              "Setup domain dan hosting",
              "Launching website hingga dapat diakses online",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Best Choice",
            order: 12,
          },
        ],
      });
      console.log("Sample packages created");
    } else {
      console.log("Packages already exist");
    }

    const testimonials = await prisma.testimonial.findMany();
    if (testimonials.length === 0) {
      await prisma.testimonial.createMany({
        data: [
          {
            name: "Pak Ainur & Pak Taufik",
            brand: "Tour Travel Umroh Al Hasan",
            content:
              "Website sesuai harapan, leads bisa masuk 5 jamaah dalam sebulan. Pengelolaan TikTok dan Instagram juga konsisten membangun awareness.",
            rating: 5,
          },
          {
            name: "Pak Saimin",
            brand: "Yu! Kebab",
            content:
              "Foto produk sangat terpakai untuk menu dan media sosial di 4 outlet. Desain outletnya juga membuat kami puas.",
            rating: 4.5,
          },
          {
            name: "Pak Hartono",
            brand: "Rice Bran",
            content:
              "Company profile yang dibuat membuat produk kami lebih siap dikenalkan ke instansi lain dan punya pondasi informasi yang jelas.",
            rating: 5,
          },
          {
            name: "Pak Lanin",
            brand: "Nasi Liwet Lavanda",
            content:
              "Video company profile-nya keren dan membantu kami tampil lebih percaya diri sampai juara di kompetisi Bali.",
            rating: 5,
          },
          {
            name: "Pak Megel",
            brand: "PT Wana Kencana Mineral",
            content:
              "Video release yang dibuat membantu penyampaian isu kami lebih jelas, terarah, dan mendapat perhatian yang sesuai.",
            rating: 5,
          },
          {
            name: "Ibu Aisyah",
            brand: "Kebab Endul Frozen",
            content:
              "Live streaming jadi lebih terarah, lebih ramai ditonton, dan optimasi Shopee membantu produk lebih terbaca algoritma.",
            rating: 4,
          },
          {
            name: "Hj. Linda Maftuhah",
            brand: "Pondok Pesantren An-Najah",
            content:
              "Media sosial dan website sekolah membantu aktivitas santri dan siswa lebih terekspos secara digital.",
            rating: 5,
          },
          {
            name: "Pak Mansur",
            brand: "Kapsul Herbalamb",
            content:
              "Pengelolaan media jadi lebih rapi, dan testimoni produk membantu calon pembeli semakin yakin.",
            rating: 5,
          },
          {
            name: "Kak Kiki Chandra",
            brand: "Jakarta Garden City",
            content:
              "Konten vlog yang dibuat terasa relatable, sesuai target pasar, dan berhasil membantu kami meraih beberapa juara.",
            rating: 5,
          },
          {
            name: "Pak Basuni",
            brand: "PT Bina Auto Solusi",
            content:
              "Arahan creative video dan strategi marketing sangat membantu penjualan online meningkat sampai omzet bulanan melonjak.",
            rating: 5,
          },
        ],
      });
      console.log("Sample testimonials created");
    } else {
      console.log("Testimonials already exist");
    }

    const promos = await prisma.promo.findMany();
    if (promos.length === 0) {
      const seededPackages = await prisma.package.findMany({
        orderBy: { order: "asc" },
      });
      await prisma.promo.create({
        data: {
          name: "Launch Promo",
          description: "Diskon launching terbatas untuk campaign bulan ini",
          code: "LAUNCH25",
          discountType: "percentage",
          discountValue: 25,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isActive: true,
          packages: {
            create: seededPackages.map((pkg) => ({ packageId: pkg.id })),
          },
        },
      });
      console.log("Sample promo created");
    } else {
      console.log("Promos already exist");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
