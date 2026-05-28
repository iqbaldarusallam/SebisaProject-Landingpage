import Link from "next/link";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiShield,
} from "react-icons/fi";
import CheckoutForm from "@/components/CheckoutForm";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/client-utils";

type CheckoutPageProps = {
  searchParams: Promise<{
    packageId?: string | string[];
    promo?: string | string[];
  }>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFeatures(features: string) {
  const trimmed = features.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return trimmed
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const packageId = Number(readParam(params.packageId));
  const promoCode = readParam(params.promo)?.trim().toUpperCase() ?? "";

  const selectedPackage = Number.isFinite(packageId)
    ? await prisma.package.findUnique({
        where: { id: packageId },
      })
    : null;

  if (!selectedPackage) {
    return (
      <section className="min-h-screen bg-[#f4f7fb] px-5 pb-16 pt-28">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase text-[#206586]">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[#131C36]">
            Paket belum dipilih.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            Silakan pilih paket terlebih dahulu supaya kami bisa menyiapkan
            ringkasan harga dan pembayaran dengan benar.
          </p>
          <Link
            href="/#paket"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#173472] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#131C36]"
          >
            <FiArrowLeft aria-hidden />
            Pilih Paket
          </Link>
        </div>
      </section>
    );
  }

  const features = parseFeatures(selectedPackage.features).slice(0, 5);
  const hasSalePrice =
    selectedPackage.salePrice !== null &&
    selectedPackage.salePrice !== undefined &&
    selectedPackage.salePrice < selectedPackage.price;
  const normalPrice = selectedPackage.price;
  const checkoutPrice = hasSalePrice
    ? selectedPackage.salePrice!
    : selectedPackage.price;
  const packageSavings = Math.max(0, normalPrice - checkoutPrice);
  const packageSavingsPercent =
    normalPrice > 0 ? Math.round((packageSavings / normalPrice) * 100) : 0;

  return (
    <section className="min-h-screen bg-[#f4f7fb] px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#paket"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#173472] transition-colors hover:text-[#206586]"
        >
          <FiArrowLeft aria-hidden />
          Kembali ke paket
        </Link>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-[#131C36] sm:text-4xl">
              Lengkapi data pemesanan kamu.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Detail paket dan total pembayaran ditampilkan transparan sebelum
              kamu masuk ke halaman pembayaran Midtrans.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF8FF] text-[#206586]">
                <FiShield aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-[#131C36]">
                  Pembayaran Aman
                </p>
                <p className="text-xs text-slate-500">
                  Diproses melalui Midtrans.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF7F1] text-green-700">
                <FiCreditCard aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-[#131C36]">Total Jelas</p>
                <p className="text-xs text-slate-500">
                  Harga promo dan kupon dihitung terpisah.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-5">
            <div className="rounded-lg bg-[#101D3F] p-6 text-white shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                Paket Dipilih
              </p>
              <h2 className="mt-3 text-2xl font-extrabold">
                {selectedPackage.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {selectedPackage.description}
              </p>

              <div className="mt-6 rounded-lg border border-white/10 bg-white/10 p-4">
                {packageSavings > 0 && (
                  <p className="text-sm text-slate-300 line-through">
                    {formatCurrency(normalPrice)}
                  </p>
                )}
                <p className="mt-1 text-3xl font-extrabold">
                  {formatCurrency(checkoutPrice)}
                </p>
                {packageSavings > 0 && (
                  <p className="mt-2 text-sm font-semibold text-cyan-200">
                    Hemat {packageSavingsPercent}% dari harga normal
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#131C36]">
                Yang kamu dapatkan
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {features.length > 0 ? (
                  features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <FiCheckCircle
                        aria-hidden
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                      <span>{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">
                    Detail paket akan disesuaikan dengan kebutuhan kamu.
                  </li>
                )}
              </ul>
            </div>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#206586]">
                Data Pemesan
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#131C36]">
                Konfirmasi checkout
              </h2>
            </div>

            <CheckoutForm
              packageId={selectedPackage.id}
              packageName={selectedPackage.name}
              basePrice={checkoutPrice}
              normalPrice={normalPrice}
              initialPromoCode={promoCode}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
