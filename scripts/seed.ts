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
            name: "Basic",
            category: "social-media-management",
            description:
              "Untuk brand yang baru mulai konsisten di media sosial.",
            price: 999000,
            strikePrice: 1500000,
            duration: "1 bulan",
            features: [
              "12 konten feed/reels",
              "Caption dasar",
              "Riset hashtag",
              "Laporan bulanan",
            ].join("\n"),
            badgeType: "none",
            order: 1,
          },
          {
            name: "Standard",
            category: "social-media-management",
            description:
              "Untuk bisnis yang ingin konten dan engagement lebih rapi.",
            price: 2499000,
            strikePrice: 3500000,
            duration: "1 bulan",
            features: [
              "20 konten feed/reels",
              "Copywriting caption",
              "Content calendar",
              "Admin posting",
            ].join("\n"),
            popular: true,
            badgeType: "popular",
            order: 2,
          },
          {
            name: "Premium",
            category: "social-media-management",
            description: "Untuk brand yang butuh strategi konten lengkap.",
            price: 4499000,
            strikePrice: 6000000,
            duration: "1 bulan",
            features: [
              "30 konten feed/reels",
              "Strategi konten bulanan",
              "Admin posting dan report",
              "Optimasi engagement",
            ].join("\n"),
            badgeType: "discount",
            order: 3,
          },
          {
            name: "Feed Design",
            category: "graphic-design",
            description: "Desain feed Instagram yang rapi dan siap upload.",
            price: 99000,
            duration: "1-2 hari",
            features: [
              "1 desain feed",
              "Format PNG/JPG",
              "Revisi minor 1x",
            ].join("\n"),
            badgeType: "none",
            order: 10,
          },
          {
            name: "Banner Design",
            category: "graphic-design",
            description: "Desain banner untuk promo, marketplace, atau ads.",
            price: 130000,
            duration: "1-2 hari",
            features: [
              "1 desain banner",
              "Ukuran sesuai kebutuhan",
              "Revisi minor 1x",
            ].join("\n"),
            badgeType: "custom",
            badgeText: "Edit Set B",
            order: 11,
          },
          {
            name: "Branding Kit",
            category: "graphic-design",
            description: "Paket identitas visual dasar untuk brand baru.",
            price: 799000,
            strikePrice: 1200000,
            duration: "5-7 hari",
            features: [
              "Logo direction",
              "Palet warna",
              "Template feed",
              "Mini brand guide",
            ].join("\n"),
            badgeType: "discount",
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
            name: "Kopi Ruang Kota",
            brand: "Food & Beverage",
            content:
              "Landing page baru bikin leads masuk lebih rapi, dan tim kami bisa pantau order tanpa spreadsheet manual.",
            rating: 5,
          },
          {
            name: "Nusa Kreatif",
            brand: "Creative Studio",
            content:
              "Copywriting dan flow checkout-nya simpel. Cocok untuk traffic iklan yang butuh keputusan cepat.",
            rating: 5,
          },
          {
            name: "Aruna Skincare",
            brand: "Beauty",
            content:
              "Promo countdown dan harga coret membantu banget saat campaign launching produk baru.",
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
