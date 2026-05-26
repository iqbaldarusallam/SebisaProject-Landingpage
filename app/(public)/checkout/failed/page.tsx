import Link from "next/link";
import AnimatedPaymentStatus from "../success/AnimatedPaymentStatus";

type CheckoutFailedProps = {
  searchParams: Promise<{
    orderId?: string | string[];
    order_id?: string | string[];
    reason?: string | string[];
    status?: string | string[];
    transaction_status?: string | string[];
  }>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getFailureMessage(reason?: string) {
  if (reason === "closed") {
    return "Kamu menutup halaman pembayaran sebelum transaksi selesai. Jika ingin melanjutkan, silakan ulangi checkout.";
  }

  if (reason === "expire") {
    return "Waktu pembayaran sudah habis. Silakan buat transaksi baru untuk melanjutkan.";
  }

  if (reason === "deny" || reason === "cancel") {
    return "Transaksi dibatalkan atau ditolak oleh sistem pembayaran. Silakan coba lagi dengan metode pembayaran lain.";
  }

  return "Pembayaran belum berhasil. Silakan ulangi checkout atau hubungi admin jika saldo sudah terpotong.";
}

export default async function CheckoutFailed({
  searchParams,
}: CheckoutFailedProps) {
  const params = await searchParams;
  const orderId = readParam(params.orderId) ?? readParam(params.order_id);
  const reason =
    readParam(params.reason) ??
    readParam(params.status) ??
    readParam(params.transaction_status);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7f7] px-4 pb-16 pt-24 sm:pt-28">
      <section className="w-full max-w-xl text-center">
        <AnimatedPaymentStatus status="failed" />

        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600">
          Pembayaran Gagal
        </p>
        <h1 className="mb-4 text-3xl font-bold text-[#131C36]">
          Transaksi belum berhasil.
        </h1>
        <p className="mx-auto mb-8 max-w-md text-gray-600">
          {getFailureMessage(reason)}
        </p>

        <div className="mb-8 rounded-lg border border-red-100 bg-white p-5 text-left shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
            <span className="text-sm text-gray-500">Nomor Referensi</span>
            <span className="text-right text-sm font-semibold text-[#131C36]">
              {orderId ?? "-"}
            </span>
          </div>
          <div className="pt-3 text-sm text-gray-600">
            Simpan nomor ini jika kamu perlu konfirmasi pembayaran ke admin.
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/#paket"
            className="inline-flex items-center justify-center rounded-lg bg-[#173472] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#131C36]"
          >
            Ulangi Checkout
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-white"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </div>
  );
}
