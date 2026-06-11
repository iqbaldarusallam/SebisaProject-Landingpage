import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import MotionReveal from "./MotionReveal";
import { WHATSAPP_CONSULTATION_URL } from "@/lib/whatsapp";

const Footer = () => {
  return (
    <footer className="bg-[#131C36] text-white">
      <div className="mx-auto max-w-screen-2xl px-5 py-14 sm:px-6 sm:py-16">
        <MotionReveal>
          <div className="grid gap-10 lg:grid-cols-4">
            <div className="space-y-5">
              <Logo className="w-40" />

              <p className="text-gray-300 leading-relaxed">
                Mitra digital terpercaya untuk UMKM, personal brand, dan
                perusahaan yang ingin tampil lebih profesional.
              </p>
            </div>

            {/* LAYANAN */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Layanan</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-white cursor-pointer">
                  Website Professional
                </li>
                <li className="hover:text-white cursor-pointer">
                  Landing Page
                </li>
                <li className="hover:text-white cursor-pointer">
                  Media Sosial
                </li>
                <li className="hover:text-white cursor-pointer">
                  Iklan Digital
                </li>
                <li className="hover:text-white cursor-pointer">
                  Liputan Berita
                </li>
                <li className="hover:text-white cursor-pointer">
                  Branding Produk
                </li>
                <li className="hover:text-white cursor-pointer">
                  Merchandise Brand
                </li>
                <li className="hover:text-white cursor-pointer">
                  Media YouTube
                </li>
                <li className="hover:text-white cursor-pointer">
                  Company Profile
                </li>
              </ul>
            </div>

            {/* QUICK LINK */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Link</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="/" className="hover:text-white">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/#layanan" className="hover:text-white">
                    Layanan
                  </Link>
                </li>
                <li>
                  <Link href="/#paket" className="hover:text-white">
                    Paket
                  </Link>
                </li>
                <li>
                  <Link href="/#portofolio" className="hover:text-white">
                    Portofolio
                  </Link>
                </li>
                <li>
                  <Link href="/#kontak" className="hover:text-white">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* DUKUNGAN */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Dukungan</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <a
                    href={WHATSAPP_CONSULTATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </MotionReveal>

        {/* Divider */}
        <div className="my-10 border-t border-gray-700"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-5 lg:flex-row">
          <p className="text-gray-400 text-sm">
            2026 Sebisa Project. Hak cipta dilindungi.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/#layanan"
              className="rounded-xl border border-white px-5 py-2 text-center text-sm transition hover:bg-white hover:text-[#131C36]"
            >
              Lihat Semua Layanan
            </Link>

            <a
              href={WHATSAPP_CONSULTATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-5 py-2 text-center text-sm font-medium text-[#131C36] transition hover:bg-gray-200"
            >
              Konsultasi Sekarang
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
