"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FaStar } from "react-icons/fa";

type CardTestimoniProps = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
};

export default function CardTestimoni({
  quote,
  name,
  role,
  initials,
  rating,
}: CardTestimoniProps) {
  const reduceMotion = useReducedMotion();
  const normalizedRating = Math.min(5, Math.max(1, Math.round(rating)));

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-52.5 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:h-75 sm:rounded-[22px] sm:p-6 md:h-67.5"
    >
      {/* Stars */}
      <div className="mb-3 flex gap-1 sm:mb-4">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={
              index < normalizedRating ? "text-yellow-400" : "text-gray-200"
            }
          />
        ))}
      </div>

      {/* Quote */}
      <p className="line-clamp-4 text-xs leading-relaxed text-gray-500 sm:line-clamp-3 sm:text-sm md:text-base">
        &ldquo;{quote}&rdquo;
      </p>

      {/* User */}
      <div className="mt-auto flex items-center gap-2 pt-4 sm:gap-3 sm:pt-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173472] text-sm font-bold text-white sm:h-12 sm:w-12 sm:text-lg">
          {initials}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#173472] sm:text-base">
            {name}
          </h3>

          <p className="truncate text-xs text-gray-400 sm:text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
