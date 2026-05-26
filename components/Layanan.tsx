"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
    title: "Marketplace & Toko Online",
    desc: "Pengembangan dan pengelolaan marketplace maupun toko online untuk membantu bisnis meningkatkan penjualan secara digital melalui platform e-commerce. Layanan meliputi setup toko online, optimasi tampilan produk, pengelolaan katalog, integrasi pembayaran, strategi promosi marketplace, serta pendampingan pengelolaan toko agar bisnis lebih mudah menjangkau pelanggan dan meningkatkan performa penjualan online.",
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
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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
              delay={i * 0.08}
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
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-sky-700 px-4 py-2 text-sky-700 transition hover:bg-sky-700 hover:text-white"
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
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="col-span-2 rounded-xl bg-sky-800 p-5 text-center text-white sm:p-6">
              <div className="text-2xl font-bold sm:text-3xl">100+</div>
              <p className="mt-1 text-xs text-gray-200">
                Website berhasil dibangun dan digunakan
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4 text-center text-white sm:p-5">
              <div className="text-xl font-bold">80+</div>
              <p className="mt-1 text-xs text-gray-300">
                Client puas dengan layanan
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4 text-center text-white sm:p-5">
              <div className="text-xl font-bold">4.9/5</div>
              <p className="mt-1 text-xs text-gray-300">
                Rating rata-rata client
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4 text-center text-white sm:p-5">
              <div className="text-xl font-bold">91%</div>
              <p className="mt-1 text-xs text-gray-300">
                Project selesai tepat waktu
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4 text-center text-white sm:p-5">
              <div className="text-xl font-bold">24/7</div>
              <p className="mt-1 text-xs text-gray-300">Tim support standby</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Layanan;

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
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex min-w-0 flex-col rounded-xl border border-sky-200 bg-[#E0F2FE] p-3 shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl sm:p-6"
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
