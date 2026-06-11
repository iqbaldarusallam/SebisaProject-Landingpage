import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function expireEndedPromos(now = new Date()) {
  await prisma.promo.updateMany({
    where: {
      isActive: true,
      endDate: {
        lt: now,
      },
    },
    data: {
      isActive: false,
    },
  });
}

export async function findBlockingCountdownPromo({
  endDate,
  excludeId,
  isActive,
  now = new Date(),
  showCountdown,
}: {
  endDate?: Date;
  excludeId?: number;
  isActive: boolean;
  now?: Date;
  showCountdown: boolean;
}) {
  if (!isActive || !showCountdown || !endDate || endDate < now) {
    return null;
  }

  const where: Prisma.PromoWhereInput = {
    isActive: true,
    showCountdown: true,
    code: {
      not: {
        startsWith: "AUTO-",
      },
    },
    endDate: {
      gte: now,
    },
  };

  if (excludeId) {
    where.id = {
      not: excludeId,
    };
  }

  return prisma.promo.findFirst({
    where,
    orderBy: { endDate: "asc" },
    select: {
      id: true,
      name: true,
      code: true,
      endDate: true,
    },
  });
}

export function getCountdownConflictMessage(
  promo: NonNullable<Awaited<ReturnType<typeof findBlockingCountdownPromo>>>,
) {
  return `Countdown promo sudah dipakai oleh ${promo.name} (${promo.code}). Nonaktifkan promo tersebut atau sembunyikan countdown-nya terlebih dahulu.`;
}
