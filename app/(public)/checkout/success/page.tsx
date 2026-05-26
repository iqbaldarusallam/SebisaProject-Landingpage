import Link from "next/link";
import AnimatedPaymentStatus from "./AnimatedPaymentStatus";

type CheckoutSuccessProps = {
  searchParams: Promise<{
    orderId?: string | string[];
    order_id?: string | string[];
    result?: string | string[];
    status?: string | string[];
    transaction_status?: string | string[];
  }>;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const failedStatuses = new Set([
  "cancel",
  "deny",
  "error",
  "expire",
  "failed",
  "failure",
]);

export default async function CheckoutSuccess({
  searchParams,
}: CheckoutSuccessProps) {
  const params = await searchParams;
  const orderId = readParam(params.orderId) ?? readParam(params.order_id);
  const status =
    readParam(params.status) ??
    readParam(params.result) ??
    readParam(params.transaction_status);
  const isPending = status === "pending";
  const isFailed = failedStatuses.has(String(status ?? "").toLowerCase());
  const paymentStatus = isFailed ? "failed" : isPending ? "pending" : "success";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 pb-16 pt-24 sm:pt-28">
      <section className="w-full max-w-xl text-center">
        <AnimatedPaymentStatus status={paymentStatus} />

        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#206586]">
          {isFailed
            ? "Pembayaran Gagal"
            : isPending
              ? "Pembayaran Diproses"
              : "Pembayaran Berhasil"}
        </p>
        <h1 className="mb-4 text-3xl font-bold text-[#131C36]">
          {isFailed
            ? "Pembayaran belum berhasil."
            : "Terima kasih, pesanan kamu sudah kami terima."}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-gray-600">
          {isFailed
            ? "Silakan ulangi checkout atau hubungi admin jika saldo sudah terpotong."
            : isPending
              ? "Midtrans masih memproses konfirmasi pembayaran. Status order akan berubah otomatis setelah notifikasi pembayaran diterima."
              : "Pembayaran sudah selesai. Tim Sebisa Project akan menghubungi kamu melalui email atau WhatsApp untuk langkah berikutnya."}
        </p>

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm">
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

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-[#173472] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#131C36]"
        >
          Kembali ke Beranda
        </Link>
      </section>
    </div>
  );
}
