"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { formatCurrency } from "@/lib/client-utils";

type BadgeType = "none" | "popular" | "discount" | "custom";

type CardPacketProps = {
  id: number;
  badgeType?: string;
  badgeText?: string;
  title: string;
  price?: number;
  oldPrice?: number;
  duration?: string;
  description: string;
  features: string[];
};

function getClaimedPromoCode() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("promo")?.trim() ?? "";
}

function getBadgeLabel(
  badgeType: string | undefined,
  badgeText: string | undefined,
  price: number,
  oldPrice: number | undefined,
) {
  const type = (badgeType ?? "none") as BadgeType;
  const hasDiscount = oldPrice && oldPrice > price;

  if (type === "popular") {
    return "POPULER";
  }

  if (type === "discount" && hasDiscount) {
    const percent = Math.round(((oldPrice - price) / oldPrice) * 100);
    return `Hemat ${percent}%`;
  }

  if (type === "custom") {
    return badgeText?.trim() || undefined;
  }

  return undefined;
}

export default function CardPacket({
  id,
  badgeType,
  badgeText,
  title,
  price = 0,
  oldPrice,
  duration,
  description,
  features,
}: CardPacketProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const normalizedBadgeType = (badgeType ?? "none") as BadgeType;
  const isPopular = normalizedBadgeType === "popular";
  const badgeLabel = getBadgeLabel(
    normalizedBadgeType,
    badgeText,
    price,
    oldPrice,
  );

  return (
    <>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -8, scale: 1.01 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative mt-4 flex h-97.5 min-h-0 flex-col
          rounded-2xl
          border-2 px-3 pb-4 pt-6
          text-white shadow-xl
          transition-shadow duration-[400ms]
          hover:shadow-cyan-500/20
          bg-linear-to-b
          from-[#102155]
          via-[#173472]
          to-[#1C4173]
          sm:mt-6 sm:h-130 sm:rounded-[22px] sm:px-5 sm:pb-5 sm:pt-7
          ${isPopular ? "border-red-500" : "border-cyan-400/70"}
        `}
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-[#39B2EC]/10 to-[#206586]/10 sm:rounded-[22px]" />

        {badgeLabel && (
          <div
            className={`
              absolute -top-4 left-1/2 z-20
              -translate-x-1/2
              whitespace-nowrap
              rounded-full px-3 py-1
              text-[8px] font-bold uppercase
              text-white shadow-lg
              sm:px-4 sm:text-[10px]
              ${isPopular ? "bg-red-500" : "bg-[#1F9CCB]"}
            `}
          >
            {badgeLabel}
          </div>
        )}

        <div className="relative z-10 flex h-full flex-col">
          <div className="rounded-full bg-[#2A4E88] px-2 py-2 text-center sm:px-3">
            <h3 className="text-xs font-bold leading-tight text-cyan-300 sm:text-base">
              {title}
            </h3>
          </div>

          <p className="mt-4 line-clamp-3 min-h-54px text-center text-xs leading-relaxed text-slate-300 sm:mt-5 sm:min-h-15.5 sm:text-sm">
            {description}
          </p>

          {oldPrice && oldPrice > price && (
            <p className="mt-3 text-center text-xs text-slate-400 line-through sm:text-sm">
              {formatCurrency(oldPrice)}
            </p>
          )}

          {price > 0 && (
            <h2 className="mt-1 text-center text-lg font-extrabold sm:text-3xl">
              {formatCurrency(price)}
            </h2>
          )}

          <ul className="mt-4 flex-1 space-y-1.5 overflow-hidden text-xs leading-relaxed text-slate-200 sm:mt-6 sm:space-y-2 sm:text-sm">
            {features.length > 0 ? (
              features.slice(0, 6).map((feature, index) => (
                <li key={index} className="line-clamp-2">
                  {feature}
                </li>
              ))
            ) : (
              <li className="text-slate-400">
                Detail paket menyesuaikan kebutuhan.
              </li>
            )}
          </ul>

          {duration && (
            <p className="mt-4 text-center text-xs font-semibold text-white sm:mt-5 sm:text-sm">
              {duration}
            </p>
          )}

          <motion.button
            onClick={() => {
              const params = new URLSearchParams({ packageId: String(id) });
              const promoCode = getClaimedPromoCode();

              if (promoCode) {
                params.set("promo", promoCode);
              }

              router.push(`/checkout?${params.toString()}`);
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="
              mt-5 min-h-10 w-full rounded-full py-2.5
              text-xs font-bold text-white
              transition-shadow duration-[400ms]
              bg-linear-to-b
              from-[#39B2EC]
              to-[#206586]
            "
          >
            Beli Sekarang
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
