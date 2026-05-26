import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminDashboard() {
  const [totalPackages, totalTransactions, totalPromos, latestOrders] =
    await Promise.all([
      prisma.package.count(),
      prisma.order.count(),
      prisma.promo.count(),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { package: true },
      }),
    ]);

  const statCards = [
    {
      label: "Total Paket",
      value: totalPackages,
      href: "/admin/packages",
    },
    {
      label: "Total Transaksi",
      value: totalTransactions,
      href: "/admin/orders",
    },
    {
      label: "Total Promo",
      value: totalPromos,
      href: "/admin/promos",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#173472]">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-slate-600">
            Pantau paket, promo, dan transaksi terbaru dari satu tempat.
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="rounded-xl bg-[#173472] px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#131C36]"
        >
          Tambah Paket
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-sm font-semibold text-slate-500">
              {card.label}
            </p>
            <p className="mt-3 text-4xl font-black text-[#173472]">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Transaksi Terbaru
            </h2>
            <p className="text-sm text-slate-500">
              Data diambil langsung dari order terbaru.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-bold text-[#173472] hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Paket</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {latestOrders.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan={5}>
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                latestOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {order.package?.name ?? "Paket sudah dihapus"}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
