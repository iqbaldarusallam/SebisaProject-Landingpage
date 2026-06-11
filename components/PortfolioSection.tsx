"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Portfolio = {
  id: number;
  brand: string;
  image: string;
};

type PortfolioSectionProps = {
  portfolios: Portfolio[];
};

type Direction = "prev" | "next";

function getOptimizedCloudinaryPortfolio(src: string) {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    return src;
  }

  if (src.includes("/upload/f_auto") || src.includes("/upload/q_auto")) {
    return src;
  }

  return src.replace("/upload/", "/upload/f_auto,q_auto,w_900,c_fit/");
}

function getCircularOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;

  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  return offset;
}

function getCardMotion(offset: number) {
  const absOffset = Math.abs(offset);
  const distance = absOffset > 1 ? 710 : 430;

  return {
    x: `calc(-50% + ${offset * distance}px)`,
    y: "-50%",
    scale: offset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.66,
    opacity: offset === 0 ? 1 : absOffset === 1 ? 0.42 : 0.16,
    rotateY: offset === 0 ? 0 : offset < 0 ? 9 : -9,
    filter: offset === 0 ? "blur(0px)" : absOffset === 1 ? "blur(0.5px)" : "blur(2px)",
    zIndex: offset === 0 ? 20 : absOffset === 1 ? 10 : 1,
  };
}

export default function PortfolioSection({
  portfolios,
}: PortfolioSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");

  const visiblePortfolios = useMemo(
    () =>
      portfolios
        .map((portfolio, index) => ({
          portfolio,
          offset: getCircularOffset(index, activeIndex, portfolios.length),
        }))
        .filter(({ offset }) => Math.abs(offset) <= 2),
    [activeIndex, portfolios],
  );

  if (portfolios.length === 0) {
    return null;
  }

  const canSlide = portfolios.length > 1;

  const moveCarousel = (nextDirection: Direction) => {
    setDirection(nextDirection);
    setActiveIndex((current) => {
      const step = nextDirection === "next" ? 1 : -1;
      return (current + step + portfolios.length) % portfolios.length;
    });
  };

  const jumpToPortfolio = (index: number) => {
    if (index === activeIndex) return;

    setDirection(index > activeIndex ? "next" : "prev");
    setActiveIndex(index);
  };

  return (
    <section
      id="portofolio"
      className="overflow-hidden bg-white px-5 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-[#126FA3] sm:text-4xl">
            Portofolio
          </h2>
          <p className="mt-2 text-sm font-medium text-[#126FA3]">
            Recent Work kami sejauh ini
          </p>
        </div>

        <div className="relative mx-auto mt-8 max-w-7xl py-5">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.07)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-linear-to-r from-white to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-linear-to-l from-white to-transparent sm:w-28" />

          {canSlide && (
            <>
              <button
                type="button"
                onClick={() => moveCarousel("prev")}
                aria-label="Portofolio sebelumnya"
                className="absolute left-0 top-1/2 z-30 grid size-14 -translate-y-1/2 place-items-center rounded-full bg-slate-700/80 text-3xl text-white shadow-xl transition hover:scale-105 hover:bg-slate-800 sm:left-3 sm:size-16"
              >
                <FiChevronLeft aria-hidden />
              </button>

              <button
                type="button"
                onClick={() => moveCarousel("next")}
                aria-label="Portofolio berikutnya"
                className="absolute right-0 top-1/2 z-30 grid size-14 -translate-y-1/2 place-items-center rounded-full bg-slate-700/80 text-3xl text-white shadow-xl transition hover:scale-105 hover:bg-slate-800 sm:right-3 sm:size-16"
              >
                <FiChevronRight aria-hidden />
              </button>
            </>
          )}

          <motion.div
            drag={canSlide ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (!canSlide) return;
              if (info.offset.x < -70) moveCarousel("next");
              if (info.offset.x > 70) moveCarousel("prev");
            }}
            className={`relative z-10 mx-auto h-[136vw] max-h-[860px] min-h-[520px] overflow-hidden px-10 [perspective:1400px] sm:px-20 lg:h-[860px] ${
              canSlide ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            <AnimatePresence initial={false} custom={direction}>
              {visiblePortfolios.map(({ portfolio, offset }) => {
                const motionState = getCardMotion(offset);
                const enterFrom = direction === "next" ? 3 : -3;
                const exitTo = direction === "next" ? -3 : 3;

                return (
                  <motion.div
                    key={portfolio.id}
                    custom={direction}
                    initial={{
                      ...getCardMotion(enterFrom),
                      opacity: 0,
                    }}
                    animate={motionState}
                    exit={{
                      ...getCardMotion(exitTo),
                      opacity: 0,
                    }}
                    transition={{
                      x: {
                        type: "spring",
                        stiffness: 52,
                        damping: 24,
                        mass: 1.28,
                      },
                      y: {
                        type: "spring",
                        stiffness: 52,
                        damping: 24,
                        mass: 1.28,
                      },
                      scale: {
                        type: "spring",
                        stiffness: 70,
                        damping: 25,
                        mass: 1.05,
                      },
                      opacity: {
                        duration: 0.48,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      rotateY: {
                        duration: 0.68,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      filter: {
                        duration: 0.58,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    className="absolute left-1/2 top-1/2 aspect-[479/836] w-[78vw] max-w-[479px] will-change-transform"
                  >
                    <PortfolioCard
                      portfolio={portfolio}
                      priority={offset === 0}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {canSlide && (
            <div className="relative z-10 mt-3 flex justify-center gap-2">
              {portfolios.map((portfolio, index) => (
                <button
                  key={portfolio.id}
                  type="button"
                  onClick={() => jumpToPortfolio(index)}
                  aria-label={`Buka portofolio ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    activeIndex === index
                      ? "w-8 bg-[#126FA3]"
                      : "w-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PortfolioCard({
  portfolio,
  priority = false,
}: {
  portfolio: Portfolio;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden border border-slate-300 bg-[#E8FBFF] shadow-[0_18px_46px_rgba(15,23,42,0.12)]">
      <Image
        src={getOptimizedCloudinaryPortfolio(portfolio.image)}
        alt={`Portofolio ${portfolio.brand}`}
        fill
        sizes="(max-width: 640px) 78vw, 479px"
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}
