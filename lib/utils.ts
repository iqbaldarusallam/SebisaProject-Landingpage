import { prisma } from "@/lib/db";

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
  const basePrice = pkg.price;

  if (promoCode) {
    const promo = await prisma.promo.findUnique({
      where: { code: promoCode },
      include: { packages: true },
    });

    if (promo && promo.isActive) {
      const now = new Date();
      if (
        promo.startDate &&
        promo.endDate &&
        promo.startDate <= now &&
        now <= promo.endDate
      ) {
        const isApplicable = promo.packages.some(
          (p: { packageId: number }) => p.packageId === packageId,
        );
        if (
          isApplicable &&
          (!promo.maxUsage || promo.currentUsage < promo.maxUsage)
        ) {
          promoId = promo.id;
          if (promo.discountType === "percentage") {
            discount = (basePrice * promo.discountValue) / 100;
          } else {
            discount = promo.discountValue;
          }
        }
      }
    }
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
