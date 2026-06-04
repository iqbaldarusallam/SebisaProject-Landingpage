"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Search,
} from "lucide-react";
import { WHATSAPP_CONSULTATION_URL } from "@/lib/whatsapp";

const categories = ["Semua", "Layanan", "Proses", "Pembayaran", "Support"];

const faqs = [
  {
    category: "Layanan",
    question: "Apa saja layanan yang disediakan?",
    answer:
      "Kami menyediakan Social Media Management, Content Production, Branding, Digital Marketing, Website & Landing Page Development, Personal Branding, dan konsultasi digitalisasi bisnis.",
  },
  {
    category: "Layanan",
    question: "Apakah bisa memilih hanya satu layanan saja?",
    answer:
      "Tentu. Klien dapat memilih layanan sesuai kebutuhan bisnis tanpa harus mengambil seluruh paket layanan.",
  },
  {
    category: "Layanan",
    question: "Apakah melayani bisnis yang baru mulai atau UMKM?",
    answer:
      "Ya. Kami melayani UMKM, startup, personal brand, hingga perusahaan yang ingin meningkatkan kehadiran digital dan performa pemasarannya.",
  },
  {
    category: "Proses",
    question: "Bagaimana proses kerja sama dimulai?",
    answer:
      "Proses dimulai dari sesi konsultasi, penyusunan strategi, penawaran, lalu pelaksanaan proyek sesuai kebutuhan bisnis.",
  },
  {
    category: "Proses",
    question: "Berapa lama pengerjaan proyek?",
    answer:
      "Durasi pengerjaan bergantung pada jenis layanan yang dipilih. Estimasi waktu akan dijelaskan saat konsultasi dan proposal.",
  },
  {
    category: "Proses",
    question: "Apakah ada kontrak kerja sama?",
    answer:
      "Ya. Setiap kerja sama akan disertai proposal dan perjanjian kerja supaya scope, timeline, dan biaya lebih jelas.",
  },
  {
    category: "Support",
    question: "Apakah saya akan mendapatkan laporan hasil pekerjaan?",
    answer:
      "Ya. Untuk layanan berkala, kami menyediakan laporan performa secara periodik agar progres dan hasil pekerjaan dapat dipantau.",
  },
  {
    category: "Layanan",
    question: "Apakah bisa membantu meningkatkan penjualan bisnis?",
    answer:
      "Kami membantu meningkatkan visibilitas, branding, dan efektivitas pemasaran digital agar peluang penjualan menjadi lebih kuat.",
  },
  {
    category: "Layanan",
    question: "Apakah bisa membantu mengelola akun Instagram dari nol?",
    answer:
      "Tentu. Kami dapat membantu mulai dari strategi, perencanaan konten, produksi visual, copywriting, hingga pengelolaan rutin.",
  },
  {
    category: "Layanan",
    question: "Apakah layanan dapat disesuaikan dengan kebutuhan bisnis?",
    answer:
      "Ya. Solusi dapat disesuaikan dengan tujuan, target pasar, kondisi brand, dan anggaran bisnis.",
  },
  {
    category: "Pembayaran",
    question: "Bagaimana sistem pembayaran?",
    answer:
      "Sistem pembayaran akan dijelaskan dalam proposal kerja sama sesuai paket, kebutuhan layanan, dan kesepakatan bersama.",
  },
  {
    category: "Support",
    question: "Apakah melayani klien di luar kota?",
    answer:
      "Ya. Seluruh proses dapat dilakukan secara online, mulai dari konsultasi, koordinasi, revisi, hingga laporan pekerjaan.",
  },
  {
    category: "Layanan",
    question: "Bagaimana jika saya belum memiliki branding?",
    answer:
      "Kami dapat membantu membangun branding mulai dari logo, identitas visual, hingga strategi komunikasi brand.",
  },
  {
    category: "Support",
    question: "Apakah bisa konsultasi terlebih dahulu?",
    answer:
      "Tentu. Kami menyediakan sesi konsultasi awal untuk memahami kebutuhan bisnis sebelum menentukan layanan yang paling sesuai.",
  },
  {
    category: "Support",
    question: "Bagaimana cara menghubungi tim?",
    answer:
      "Anda dapat menghubungi kami melalui WhatsApp, email, atau formulir konsultasi yang tersedia di website.",
  },
];

export default function FAQPageContent() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeQuestion, setActiveQuestion] = useState(faqs[0].question);
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "Semua" || faq.category === activeCategory;
      const matchesKeyword =
        !keyword ||
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword);

      return matchesCategory && matchesKeyword;
    });
  }, [activeCategory, query]);

  return (
    <section className="min-h-screen bg-[#F7FAFC] px-5 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#173472] transition-colors hover:text-[#206586]"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#E9F7FB] px-4 py-2 text-sm font-bold text-[#206586]">
              <HelpCircle aria-hidden className="h-4 w-4" />
              FAQ
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight text-[#131C36] sm:text-6xl">
              Pertanyaan yang sering ditanyakan.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Temukan jawaban tentang layanan, alur kerja sama, pembayaran,
              laporan, dan cara memulai konsultasi dengan Sebisa Project.
            </p>
          </div>

          <div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
              <p className="text-sm font-bold text-[#131C36]">
                Butuh jawaban cepat?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Tim Sebisa Project siap membantu memilih layanan yang paling
                sesuai dengan kebutuhan bisnis kamu.
              </p>
              <a
                href={WHATSAPP_CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#173472] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#131C36] sm:w-auto"
              >
                <MessageCircle aria-hidden className="h-4 w-4" />
                Konsultasi Sekarang
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
            <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-bold text-[#131C36]">
                Kategori FAQ
              </p>

              <div className="relative mt-4">
                <Search
                  aria-hidden
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari pertanyaan..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#206586] focus:bg-white focus:ring-2 focus:ring-[#206586]/15"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-[#173472] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = activeQuestion === faq.question;

                  return (
                    <article
                      key={faq.question}
                      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setActiveQuestion(isOpen ? "" : faq.question)
                        }
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                      >
                        <span>
                          <span className="mb-1 block text-xs font-bold uppercase text-[#206586]">
                            {faq.category}
                          </span>
                          <span className="block text-sm font-bold leading-snug text-[#131C36] sm:text-base">
                            {faq.question}
                          </span>
                        </span>
                        <ChevronDown
                          aria-hidden
                          className={`h-5 w-5 shrink-0 text-[#206586] transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 px-4 pb-5 pt-3 text-sm leading-relaxed text-slate-600 sm:px-5 sm:text-base">
                          {faq.answer}
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-sm font-bold text-[#131C36]">
                    Pertanyaan tidak ditemukan.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Hubungi tim kami untuk konsultasi langsung.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
