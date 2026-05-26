import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sebisa.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123456";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    if (
      existingAdmin.email === "admin@sebisa.com" &&
      existingAdmin.role !== "super_admin"
    ) {
      await prisma.admin.update({
        where: { email: "admin@sebisa.com" },
        data: { role: "super_admin" },
      });
      console.log("Admin promoted to super_admin");
      return;
    }

    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcryptjs.hash(adminPassword, 10);

  await prisma.admin.create({
    data: {
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: adminEmail === "admin@sebisa.com" ? "super_admin" : "admin",
    },
  });

  console.log("Admin created");
}

main();
