import { prisma } from "@/lib/db";

const AUTOMATIC_DISCOUNT_CODE_PREFIX = "AUTO-";

export type PromoWithPackages = {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  maxUsage: number | null;
  currentUsage: number;
  packages: Array<{ packageId: number }>;
};

function isAutomaticDiscountCode(code: string) {
  return code.toUpperCase().startsWith(AUTOMATIC_DISCOUNT_CODE_PREFIX);
}

function getPromoDiscount(basePrice: number, promo: PromoWithPackages) {
  const rawDiscount =
    promo.discountType === "percentage"
      ? (basePrice * promo.discountValue) / 100
      : promo.discountValue;

  return Math.min(basePrice, Math.max(0, rawDiscount));
}

function promoAppliesToPackage(promo: PromoWithPackages, packageId: number) {
  return (
    promo.packages.length === 0 ||
    promo.packages.some((item) => item.packageId === packageId)
  );
}

function assertClaimablePromo(
  promo: PromoWithPackages | null,
  packageId: number,
): asserts promo is PromoWithPackages {
  if (!promo || isAutomaticDiscountCode(promo.code)) {
    throw new Error("Kode promo tidak ditemukan");
  }

  if (!promo.isActive) {
    throw new Error("Kode promo sedang tidak aktif");
  }

  const now = new Date();

  if (promo.startDate && promo.startDate > now) {
    throw new Error("Kode promo belum aktif");
  }

  if (promo.endDate && promo.endDate < now) {
    throw new Error("Kode promo sudah berakhir");
  }

  if (!promoAppliesToPackage(promo, packageId)) {
    throw new Error("Kode promo tidak berlaku untuk paket ini");
  }

  if (promo.maxUsage && promo.currentUsage >= promo.maxUsage) {
    throw new Error("Kuota kode promo sudah habis");
  }
}

export async function calculateOrderTotal(
  packageId: number,
  promoCode?: string,
): Promise<{
  basePrice: number;
  discount: number;
  total: number;
  promoId?: number;
}> {
  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!pkg) {
    throw new Error("Package not found");
  }

  let discount = 0;
  let promoId: number | undefined;
  const basePrice =
    pkg.salePrice && pkg.salePrice < pkg.price ? pkg.salePrice : pkg.price;
  const normalizedPromoCode = promoCode?.trim().toUpperCase();

  if (normalizedPromoCode) {
    const promo = await prisma.promo.findUnique({
      where: { code: normalizedPromoCode },
      include: { packages: true },
    });

    assertClaimablePromo(promo, packageId);
    promoId = promo.id;
    discount = getPromoDiscount(basePrice, promo);
  }

  return {
    basePrice,
    discount: Math.round(discount * 100) / 100,
    total: Math.max(0, Math.round((basePrice - discount) * 100) / 100),
    promoId,
  };
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
