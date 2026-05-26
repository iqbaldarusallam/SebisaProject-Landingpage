"use client";

import { FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { createWhatsappConsultationUrl } from "@/lib/whatsapp";

export default function ContactForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const url = createWhatsappConsultationUrl({
      name: String(formData.get("name") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      product: String(formData.get("product") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-gray-400 bg-white p-5 shadow-lg sm:mt-14 sm:p-8 lg:p-10">
      <h2 className="text-center text-3xl font-extrabold text-[#173472] sm:text-4xl md:text-5xl">
        Formulir <span className="text-black">Kontak</span>
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 sm:mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nama */}
          <div>
            <label className="mb-2 block text-base font-bold text-[#173472] sm:text-xl">
              Nama
            </label>

            <input
              name="name"
              type="text"
              required
              placeholder="Masukan nama anda"
              className="
                w-full rounded-lg border border-gray-400
                px-4 py-3 outline-none
                transition-all duration-300
                focus:border-[#173472]
              "
            />
          </div>

          {/* Brand */}
          <div>
            <label className="mb-2 block text-base font-bold text-[#173472] sm:text-xl">
              Brand
            </label>

            <input
              name="brand"
              type="text"
              required
              placeholder="Masukan brand apa"
              className="
                w-full rounded-lg border border-gray-400
                px-4 py-3 outline-none
                transition-all duration-300
                focus:border-[#173472]
              "
            />
          </div>

          {/* Produk */}
          <div>
            <label className="mb-2 block text-base font-bold text-[#173472] sm:text-xl">
              Produk
            </label>

            <input
              name="product"
              type="text"
              required
              placeholder="Masukan produk anda"
              className="
                w-full rounded-lg border border-gray-400
                px-4 py-3 outline-none
                transition-all duration-300
                focus:border-[#173472]
              "
            />
          </div>

          {/* Telepon */}
          <div>
            <label className="mb-2 block text-base font-bold text-[#173472] sm:text-xl">
              No Telepon
            </label>

            <input
              name="phone"
              type="text"
              required
              placeholder="Masukan nomor telepon"
              className="
                w-full rounded-lg border border-gray-400
                px-4 py-3 outline-none
                transition-all duration-300
                focus:border-[#173472]
              "
            />
          </div>
        </div>

        {/* Button */}
        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="
              inline-flex min-h-12 items-center gap-2 rounded-full bg-green-600 px-8 py-3
              text-base font-bold text-white sm:px-10 sm:py-4 sm:text-lg
              transition-all duration-300
              hover:scale-105 hover:bg-green-700
            "
          >
            <FaWhatsapp className="text-xl" aria-hidden="true" />
            Kirim Via Whatsapp
          </button>
        </div>
      </form>
    </div>
  );
}
