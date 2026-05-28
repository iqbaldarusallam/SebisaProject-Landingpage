"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FaBriefcase, FaGlobe, FaSmile } from "react-icons/fa";
import { WHATSAPP_CONSULTATION_URL } from "@/lib/whatsapp";

type HeroContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroClientsText: string;
  heroBottomHeading: string;
  heroBottomText: string;
  heroBottomButtonText: string;
};

type HeroBrand = {
  id: number;
  brand: string;
  image: string;
};

interface HeroProps {
  heroContent: HeroContent;
  trustedBrands: HeroBrand[];
}

const Hero = ({ heroContent, trustedBrands }: HeroProps) => {
  const reduceMotion = useReducedMotion();
  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className="relative overflow-hidden text-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-bg.png"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-white/70" />
      </div>

      {/* Hero Content */}
      <div className="mx-auto flex min-h-160 max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-28 sm:px-6 sm:pb-28 sm:pt-32 lg:min-h-190">
        {/* Logo */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/logo-navbar.png"
            alt="Sebisa Project"
            width={350}
            height={100}
            priority
            className="mb-5 h-auto w-56 sm:w-72 lg:w-auto"
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{
            duration: 1,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-4xl font-extrabold leading-[1.05] text-sky-700 sm:text-5xl md:text-6xl lg:text-8xl"
        >
          {heroContent.heroTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp}
          transition={{
            duration: 1,
            delay: 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-4 max-w-2xl text-sm leading-relaxed text-sky-800 sm:text-base md:text-lg"
        >
          {heroContent.heroSubtitle}
        </motion.p>

        {/* CTA */}
        <motion.a
          href={WHATSAPP_CONSULTATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          {...fadeUp}
          whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          transition={{
            duration: 0.95,
            delay: 0.24,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            mt-8 inline-flex min-h-11 items-center justify-center rounded-full
            bg-sky-700 px-7 py-3
            text-sm font-semibold text-white
            shadow-lg
            transition-all duration-400
            hover:bg-sky-800 sm:px-8
          "
        >
          {heroContent.heroCtaText}
        </motion.a>
      </div>

      {/* Stats Card */}
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-5xl px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.98 }}
          whileInView={
            reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
          }
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] bg-[#F4F4F4] p-4 shadow-2xl sm:p-6 lg:p-8"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-5 md:gap-6">
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl bg-white px-2 py-4 text-center shadow-md transition-shadow duration-400 hover:shadow-xl sm:rounded-2xl sm:p-6"
            >
              <FaGlobe className="mx-auto mb-2 text-xl text-sky-700 sm:mb-4 sm:text-3xl" />
              <h3 className="text-xl font-extrabold text-sky-700 sm:text-3xl">
                100+
              </h3>
              <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:mt-2 sm:text-sm">
                Website Telah Dibangun
              </p>
            </motion.div>

            <motion.div
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl bg-white px-2 py-4 text-center shadow-md transition-shadow duration-400er:shadow-xl sm:rounded-2xl sm:p-6"
            >
              <FaBriefcase className="mx-auto mb-2 text-xl text-sky-700 sm:mb-4 sm:text-3xl" />
              <h3 className="text-xl font-extrabold text-sky-700 sm:text-3xl">
                10+
              </h3>
              <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:mt-2 sm:text-sm">
                Industri Telah Terlayani
              </p>
            </motion.div>

            <motion.div
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl bg-white px-2 py-4 text-center shadow-md transition-shadow duration-400 hover:shadow-xl sm:rounded-2xl sm:p-6"
            >
              <FaSmile className="mx-auto mb-2 text-xl text-sky-700 sm:mb-4 sm:text-3xl" />
              <h3 className="text-xl font-extrabold text-sky-700 sm:text-3xl">
                80%
              </h3>
              <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:mt-2 sm:text-sm">
                Kepuasan Client
              </p>
            </motion.div>
          </div>

          {/* Client Text */}
          <p className="mt-7 text-sm leading-relaxed text-gray-500 sm:mt-8">
            {heroContent.heroClientsText}
          </p>

          {trustedBrands.length > 0 && (
            <div className="relative mt-6 overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r from-[#F4F4F4] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l from-[#F4F4F4] to-transparent" />

              <div className="marquee flex w-max gap-6 hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, loopIndex) => (
                  <div key={loopIndex} className="flex gap-4 sm:gap-6">
                    {trustedBrands.map((item) => (
                      <div
                        key={`${loopIndex}-${item.id}`}
                        aria-label={item.brand}
                        className="h-12 min-w-24 rounded-xl bg-white bg-contain bg-center bg-no-repeat px-4 shadow-sm transition-all duration-400 hover:shadow-md sm:h-16 sm:min-w-30 sm:px-5"
                        style={{ backgroundImage: `url("${item.image}")` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 w-full bg-[#131C36] px-5 py-14 text-center text-white sm:mt-20 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          >
            {heroContent.heroBottomHeading}
          </motion.h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-gray-300 md:text-base">
            {heroContent.heroBottomText}
          </p>

          <motion.a
            href={WHATSAPP_CONSULTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-sky-700 px-8 py-3 text-sm font-semibold text-white transition-colors duration-400 hover:bg-sky-800"
          >
            {heroContent.heroBottomButtonText}
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
