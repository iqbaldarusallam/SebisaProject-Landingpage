"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { WHATSAPP_CONSULTATION_URL } from "@/lib/whatsapp";

const services = [
  {
    title: "Website Professional",
    desc: "Pembuatan website profesional yang dirancang khusus untuk meningkatkan kredibilitas bisnis, memperkuat branding, serta memudahkan pelanggan dalam mendapatkan informasi mengenai produk dan layanan perusahaan. Website dikembangkan dengan tampilan modern, responsif di semua perangkat, optimasi SEO dasar, performa yang cepat, serta struktur yang disesuaikan dengan kebutuhan bisnis agar mampu memberikan pengalaman pengguna yang optimal.",
  },
  {
    title: "Landing Page & Payment Gateway",
    desc: "Pembuatan landing page yang fokus pada peningkatan konversi penjualan, promosi produk, maupun pengumpulan leads pelanggan secara efektif. Setiap landing page dirancang dengan tampilan yang menarik, call-to-action yang jelas, serta integrasi payment gateway untuk memudahkan proses transaksi online secara aman, cepat, dan profesional sehingga mendukung peningkatan penjualan bisnis secara digital.",
  },
  {
    title: "Pengelolaan Media Sosial",
    desc: "Layanan pengelolaan media sosial secara profesional untuk membantu bisnis membangun branding, meningkatkan engagement, dan memperluas jangkauan audiens di berbagai platform digital seperti Instagram, TikTok, dan Facebook. Pengelolaan meliputi perencanaan konten, penjadwalan posting, copywriting, desain visual, analisis performa akun, hingga strategi komunikasi yang disesuaikan dengan target pasar bisnis.",
  },
  {
    title: "Pengelolaan Iklan Digital",
    desc: "Layanan perencanaan dan pengelolaan iklan digital yang bertujuan meningkatkan awareness, traffic, hingga penjualan bisnis melalui platform seperti Meta Ads, Instagram Ads, Facebook Ads, dan Google Ads. Strategi iklan dirancang berdasarkan target audiens yang spesifik, pengelolaan budget yang optimal, pembuatan materi iklan yang menarik, serta monitoring performa iklan secara berkala untuk memperoleh hasil yang maksimal.",
  },
  {
    title: "Konten & Video Professional",
    desc: "Pembuatan konten visual dan video profesional yang mampu meningkatkan daya tarik brand serta memperkuat komunikasi bisnis kepada pelanggan. Layanan mencakup produksi foto produk, video promosi, video cinematic, reels media sosial, hingga editing profesional dengan konsep kreatif yang disesuaikan dengan identitas dan kebutuhan branding perusahaan agar lebih menarik dan kompetitif di era digital.",
  },
  {
    title: "Pengelolaan Media Isu & Kasus Berita",
    desc: "Layanan pengelolaan media untuk isu, kasus, atau pemberitaan tertentu dengan output berupa press release dan video pendek aktual. Materi dikembangkan dari liputan kasus, rangkuman isu, serta headline yang diangkat dari statement ahli agar pesan utama tersampaikan secara jelas, terarah, dan relevan untuk kebutuhan publikasi.",
  },
  {
    title: "Liputan Persidangan & Konferensi Pers",
    desc: "Layanan liputan berita untuk persidangan, konferensi pers, dan agenda resmi lainnya dengan dokumentasi aktual. Output dapat berupa live streaming, video pendek, rangkuman berita, serta materi publikasi yang disusun cepat dan rapi untuk kebutuhan media, brand, organisasi, maupun perusahaan.",
  },
  {
    title: "Desain Grafis, Logo & Mockup Branding",
    desc: "Pembuatan desain grafis untuk kebutuhan identitas brand, logo, mockup produk, dan materi visual bisnis. Layanan ini membantu brand memiliki tampilan yang lebih profesional, konsisten, dan mudah dikenali melalui konsep visual yang disesuaikan dengan karakter produk atau perusahaan.",
  },
  {
    title: "Pengelolaan Media YouTube",
    desc: "Layanan pengelolaan media YouTube mulai dari perencanaan konten, produksi atau editing video, optimasi judul dan deskripsi, thumbnail, penjadwalan upload, hingga evaluasi performa channel. Tujuannya membantu brand membangun kanal video yang lebih rapi, aktif, dan relevan dengan audiens.",
  },
  {
    title: "Pembuatan Company Profile Perusahaan",
    desc: "Pembuatan company profile perusahaan dalam bentuk narasi, desain visual, dan materi presentasi yang profesional. Company profile disusun untuk memperkenalkan identitas, layanan, keunggulan, portofolio, dan kredibilitas perusahaan agar lebih siap digunakan untuk kebutuhan proposal, kerja sama, maupun presentasi bisnis.",
  },
  {
    title: "Marketplace & Toko Online",
    desc: "Pengembangan dan pengelolaan marketplace maupun toko online untuk membantu bisnis meningkatkan penjualan secara digital melalui platform e-commerce. Layanan meliputi setup toko online, optimasi tampilan produk, pengelolaan katalog, integrasi pembayaran, strategi promosi marketplace, serta pendampingan pengelolaan toko agar bisnis lebih mudah menjangkau pelanggan dan meningkatkan performa penjualan online.",
  },
];

const whyStats = [
  {
    value: 100,
    suffix: "+",
    description: "Website berhasil dibangun dan diluncurkan",
    featured: true,
  },
  {
    value: 80,
    suffix: "+",
    description: "Klien puas dari berbagai industri",
  },
  {
    value: 4.9,
    suffix: "/5",
    decimals: 1,
    description: "Rating rata-rata klien",
  },
  {
    value: 91,
    suffix: "%",
    description: "Repeat order dari klien lama",
  },
  {
    value: 24,
    suffix: "/7",
    description: "Fast response & support",
  },
];

const Layanan = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-gray-100 px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex justify-center"
        >
          <span className="rounded-full bg-sky-700 px-5 py-2 text-xs font-semibold text-white sm:px-6 sm:text-sm">
            LAYANAN KAMI
          </span>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {services.map((item, i) => (
            <ServiceCard
              key={item.title}
              delay={i * 0.12}
              description={item.desc}
              reduceMotion={Boolean(reduceMotion)}
              title={item.title}
            />
          ))}
        </div>

        <div className="mt-16 grid items-center gap-10 md:grid-cols-2 lg:mt-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="text-5xl font-extrabold leading-[0.9] tracking-wide text-sky-800 sm:text-6xl md:text-7xl lg:text-8xl"
              style={{ fontFamily: "var(--font-passion)" }}
            >
              KENAPA <br /> HARUS <br /> DI SEBISA
            </h2>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <motion.a
                href={WHATSAPP_CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-sky-700 px-4 py-2 text-sky-700 transition duration-[400ms] hover:bg-sky-700 hover:text-white"
              >
                Konsultasi Gratis
              </motion.a>

              <span className="text-sky-700">24/7 Admin Active</span>
              <span className="text-sky-700">Free Konsultasi</span>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-2.5 sm:gap-3"
          >
            {whyStats.map((stat) => (
              <WhyStatCard key={stat.description} {...stat} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Layanan;

function WhyStatCard({
  decimals = 0,
  description,
  featured = false,
  suffix,
  value,
}: {
  decimals?: number;
  description: string;
  featured?: boolean;
  suffix?: string;
  value: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`flex min-h-20 flex-col items-center justify-center rounded-xl border border-cyan-300/80 text-center text-white shadow-[0_8px_18px_rgba(15,23,42,0.16)] ${
        featured
          ? "col-span-2 bg-[#244B78] px-5 py-5 sm:min-h-24"
          : "bg-[#131C36] px-3 py-4 sm:min-h-24 sm:px-4"
      }`}
    >
      <div
        className={`font-extrabold leading-none ${
          featured ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
        }`}
      >
        <CountUpValue
          decimals={decimals}
          disabled={Boolean(reduceMotion)}
          suffix={suffix}
          value={value}
        />
      </div>
      <p
        className={`mt-2 max-w-full text-[10px] leading-snug text-slate-300 sm:text-xs ${
          featured ? "sm:max-w-sm" : ""
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function CountUpValue({
  decimals,
  disabled,
  suffix,
  value,
}: {
  decimals: number;
  disabled: boolean;
  suffix?: string;
  value: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.7 });
  const [displayValue, setDisplayValue] = useState(disabled ? value : 0);

  useEffect(() => {
    if (disabled) {
      setDisplayValue(value);
      return;
    }

    if (!isInView) {
      setDisplayValue(0);
      return;
    }

    let frameId = 0;
    const duration = 1400;
    const startedAt = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [disabled, isInView, value]);

  const formattedValue = displayValue.toLocaleString("id-ID", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {formattedValue}
      {suffix && <span className="text-cyan-300">{suffix}</span>}
    </span>
  );
}

function ServiceCard({
  delay,
  description,
  reduceMotion,
  title,
}: {
  delay: number;
  description: string;
  reduceMotion: boolean;
  title: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const mobilePreviewLimit = 72;
  const desktopPreviewLimit = 150;
  const shouldTruncate = description.length > mobilePreviewLimit;
  const getPreview = (limit: number) =>
    !expanded && description.length > limit
      ? `${description.slice(0, limit).trim()}...`
      : description;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{
        duration: 0.95,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex min-w-0 flex-col rounded-xl border border-sky-200 bg-[#E0F2FE] p-3 shadow-sm transition-shadow duration-[400ms] hover:shadow-md sm:rounded-2xl sm:p-6"
    >
      <h3 className="text-sm font-bold leading-tight text-gray-800 sm:text-lg">
        {title}
      </h3>
      <p
        className={`mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm ${
          expanded ? "" : "line-clamp-3 sm:line-clamp-none"
        }`}
      >
        <span className="sm:hidden">{getPreview(mobilePreviewLimit)}</span>
        <span className="hidden sm:inline">{getPreview(desktopPreviewLimit)}</span>
      </p>
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 self-start text-xs font-semibold text-sky-700 hover:underline"
        >
          {expanded ? "Tutup" : "Pelajari lebih ->"}
        </button>
      )}
    </motion.div>
  );
}
