import { z } from "zod";

const optionalTextInput = z.preprocess(
  (value) => (value === null ? "" : value),
  z.string().optional().or(z.literal("")),
);

export const packageSchema = z.object({
  name: z.string().min(1, "Package name required"),
  category: z
    .enum(["social-media-management", "graphic-design", "website-development"])
    .default("social-media-management"),
  description: z.string().min(1, "Description required"),
  price: z.coerce.number().positive("Harga normal wajib lebih dari 0"),
  salePrice: z.preprocess(
    (val) => (val === "" ? null : val),
    z.coerce.number().positive().nullable().optional(),
  ),
  duration: z.string().optional().or(z.literal("")),
  image: optionalTextInput.transform((v) => v || undefined),
  features: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) =>
      v
        ?.split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
        .join("\n") || "",
    ),
  popular: z.boolean().default(false),
  badgeType: z
    .enum(["none", "popular", "discount", "custom"])
    .default("none"),
  badgeText: optionalTextInput.transform((v) => v?.trim() || null),
  order: z.coerce.number().default(0),
});

export const promoSchema = z.object({
  name: z.string().min(1, "Promo name required"),
  description: z.string().min(1, "Description required"),
  code: z.string().trim().min(1, "Promo code required").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.coerce.number().positive("Discount must be positive"),
  isActive: z.boolean().default(true),
  startDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  endDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  packageIds: z.array(z.number()).optional().default([]),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name required"),
  brand: z.string().min(1, "Brand or position required"),
  content: z
    .string()
    .min(1, "Content required")
    .max(200, "Testimoni maksimal 200 karakter"),
  rating: z.coerce.number().min(1).max(5).default(5),
});

export const trustedBrandSchema = z.object({
  brand: z.string().min(1, "Brand required"),
  image: z
    .string()
    .url("Image must be a valid Cloudinary URL")
    .refine(
      (value) => value.includes("res.cloudinary.com"),
      "Image must be uploaded to Cloudinary",
    ),
});

export const adminCreateSchema = z.object({
  name: z.string().trim().min(1, "Admin name required"),
  email: z.string().trim().toLowerCase().email("Valid email required"),
  password: z.string().min(6, "Password at least 6 characters"),
  role: z.enum(["admin", "super_admin"]).default("admin"),
});

export const adminUpdateSchema = adminCreateSchema
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((value) => !value || value.length >= 6, {
        message: "Password at least 6 characters",
      }),
  });

export const accountUpdateSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().toLowerCase().email("Email wajib valid"),
  currentPassword: z.string().min(6, "Password saat ini wajib diisi"),
  newPassword: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || value.length >= 6, {
      message: "Password baru minimal 6 karakter",
    }),
});

export const landingContentSchema = z.object({
  navbarPromoText: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => value?.trim() ?? ""),
  heroTitle: z.string().min(1, "Hero title required"),
  heroSubtitle: z.string().min(1, "Hero subtitle required"),
  heroCtaText: z.string().min(1, "Hero CTA text required"),
  heroClientsText: z.string().min(1, "Hero clients text required"),
  heroBottomHeading: z.string().min(1, "Hero bottom heading required"),
  heroBottomText: z.string().min(1, "Hero bottom text required"),
  heroBottomButtonText: z.string().min(1, "Hero bottom button text required"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password at least 6 characters"),
});

export const orderSchema = z.object({
  customerName: z
    .string()
    .min(1, "Name required")
    .min(3, "Name at least 3 characters"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z
    .string()
    .min(10, "Phone at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),
  packageId: z.coerce.number().positive("Package required"),
  promoCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((value) => value?.trim().toUpperCase() ?? ""),
});
