import React from "react";
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

            {/* Input Email */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                placeholder="Email Anda..."
                className="w-full rounded-xl border border-gray-500 bg-transparent px-4 py-3 text-sm text-white placeholder-gray-400 outline-none"
              />
              <button className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-600">
                Daftar
              </button>
            </div>
          </div>

          {/* LAYANAN */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Layanan</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-white cursor-pointer">
                Website Professional
              </li>
              <li className="hover:text-white cursor-pointer">Landing Page</li>
              <li className="hover:text-white cursor-pointer">Media Sosial</li>
              <li className="hover:text-white cursor-pointer">Iklan Digital</li>
              <li className="hover:text-white cursor-pointer">Liputan Berita</li>
              <li className="hover:text-white cursor-pointer">Branding Produk</li>
              <li className="hover:text-white cursor-pointer">Media YouTube</li>
              <li className="hover:text-white cursor-pointer">Company Profile</li>
            </ul>
          </div>

          {/* PERUSAHAAN */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Perusahaan</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-white cursor-pointer">Tentang Kami</li>
              <li className="hover:text-white cursor-pointer">Tim Kami</li>
              <li className="hover:text-white cursor-pointer">Portofolio</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
            </ul>
          </div>

          {/* DUKUNGAN */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Dukungan</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="hover:text-white cursor-pointer">FAQ</li>
              <li className="hover:text-white cursor-pointer">Help Center</li>
              <li className="hover:text-white cursor-pointer">Privasi</li>
              <li>
                <a
                  href={WHATSAPP_CONSULTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Whatsapp
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
            2024 Sebisa Project. Hak cipta dilindungi.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button className="rounded-xl border border-white px-5 py-2 text-sm hover:bg-white hover:text-[#131C36] transition">
              Lihat Semua Layanan
            </button>

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
