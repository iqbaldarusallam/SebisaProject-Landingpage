import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowUpRight,
  Banknote,
  PackageCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { DashboardBusinessCharts } from "@/components/admin/DashboardBusinessCharts";
import {
  LatestOrdersTable,
  type LatestOrderRow,
} from "@/components/admin/LatestOrdersTable";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { prisma } from "@/lib/db";
import { getPackageCategoryTitle } from "@/lib/package-categories";

export const dynamic = "force-dynamic";

const paidStatus = "paid";
const statusLabels: Record<string, string> = {
  pending: "Pending",
  paid: "Success",
  failed: "Gagal",
  expired: "Expired",
  refunded: "Refund",
  partial_refunded: "Partial Refund",
  canceled: "Canceled",
};
const statusChartColors: Record<string, string> = {
  pending: "#F59E0B",
  paid: "#10B981",
  failed: "#EF4444",
  expired: "#64748B",
  refunded: "#0EA5E9",
  partial_refunded: "#0284C7",
  canceled: "#DC2626",
};

type StatCard = {
  label: string;
  value: string;
  helper: string;
  href: string;
  icon: LucideIcon;
  tone: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatPercent(value: number) {
  return `${value.toLocaleString("id-ID", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })}%`;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getRelativeDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function getPercentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export default async function AdminDashboard() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      package: true,
      promo: true,
    },
  });

  const paidOrders = orders.filter((order) => order.status === paidStatus);
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const expiredOrders = orders.filter((order) => order.status === "expired");
  const cancelledOrders = orders.filter((order) => order.status === "canceled");
  const refundedOrders = orders.filter((order) =>
    order.status === "refunded" || order.status === "partial_refunded",
  );
  const customerCount = new Set(
    orders.map((order) => order.customerEmail.trim().toLowerCase()),
  ).size;
  const totalRevenue = paidOrders.reduce(
    (total, order) => total + order.totalPrice,
    0,
  );
  const pendingPotential = pendingOrders.reduce(
    (total, order) => total + order.totalPrice,
    0,
  );
  const successRate =
    orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0;

  const last30Days = getRelativeDate(30);
  const previous60Days = getRelativeDate(60);
  const revenueLast30 = paidOrders
    .filter((order) => order.createdAt >= last30Days)
    .reduce((total, order) => total + order.totalPrice, 0);
  const revenuePrevious30 = paidOrders
    .filter(
      (order) => order.createdAt >= previous60Days && order.createdAt < last30Days,
    )
    .reduce((total, order) => total + order.totalPrice, 0);
  const revenueGrowth = getPercentChange(revenueLast30, revenuePrevious30);

  const monthStarts = Array.from({ length: 6 }, (_, index) => {
    const date = getMonthStart(new Date());
    date.setMonth(date.getMonth() - (5 - index));
    return date;
  });
  const monthlyData = monthStarts.map((monthStart) => {
    const monthKey = getMonthKey(monthStart);
    const monthPaidOrders = paidOrders.filter(
      (order) => getMonthKey(order.createdAt) === monthKey,
    );

    return {
      month: getMonthLabel(monthStart),
      revenue: monthPaidOrders.reduce(
        (total, order) => total + order.totalPrice,
        0,
      ),
      orders: monthPaidOrders.length,
    };
  });

  const topPackageMap = new Map<
    string,
    { name: string; orders: number; revenue: number }
  >();
  for (const order of paidOrders) {
    const name = order.package?.name ?? "Paket sudah dihapus";
    const current = topPackageMap.get(name) ?? {
      name,
      orders: 0,
      revenue: 0,
    };
    current.orders += 1;
    current.revenue += order.totalPrice;
    topPackageMap.set(name, current);
  }
  const topPackages = Array.from(topPackageMap.values())
    .sort((a, b) => b.orders - a.orders || b.revenue - a.revenue)
    .slice(0, 5);
  const maxPackageOrders = Math.max(
    ...topPackages.map((item) => item.orders),
    1,
  );

  const statusMap = new Map<string, number>();
  for (const order of orders) {
    statusMap.set(order.status, (statusMap.get(order.status) ?? 0) + 1);
  }
  const statusData = Array.from(statusMap.entries())
    .map(([status, value]) => ({
      status,
      label: statusLabels[status] ?? status,
      value,
      percent: orders.length > 0 ? (value / orders.length) * 100 : 0,
      color: statusChartColors[status] ?? "#94A3B8",
    }))
    .sort((a, b) => b.value - a.value);

  const categoryMap = new Map<
    string,
    { name: string; revenue: number; orders: number }
  >();
  for (const order of paidOrders) {
    const name = getPackageCategoryTitle(order.package?.category ?? "");
    const current = categoryMap.get(name) ?? {
      name,
      revenue: 0,
      orders: 0,
    };
    current.revenue += order.totalPrice;
    current.orders += 1;
    categoryMap.set(name, current);
  }
  const categoryData = Array.from(categoryMap.values()).sort(
    (a, b) => b.revenue - a.revenue,
  );

  const promoMap = new Map<
    string,
    { code: string; orders: number; revenue: number }
  >();
  for (const order of paidOrders) {
    if (!order.promo?.code) continue;
    const code = order.promo.code;
    const current = promoMap.get(code) ?? {
      code,
      orders: 0,
      revenue: 0,
    };
    current.orders += 1;
    current.revenue += order.totalPrice;
    promoMap.set(code, current);
  }
  const promoData = Array.from(promoMap.values())
    .sort((a, b) => b.orders - a.orders || b.revenue - a.revenue)
    .slice(0, 4);

  const latestOrders: LatestOrderRow[] = orders.slice(0, 5).map((order) => ({
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    followedUpAt: order.followedUpAt?.toISOString() ?? null,
    package: order.package
      ? {
          name: order.package.name,
        }
      : null,
  }));
  const bestPackage = topPackages[0];
  const bestCategory = categoryData[0];

  const statCards: StatCard[] = [
    {
      label: "Pendapatan",
      value: formatCurrency(totalRevenue),
      helper: `${formatPercent(revenueGrowth)} vs 30 hari lalu`,
      href: "/admin/orders",
      icon: Banknote,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Order Success",
      value: formatNumber(paidOrders.length),
      helper: `Success rate ${formatPercent(successRate)}`,
      href: "/admin/orders",
      icon: ShoppingCart,
      tone: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "Customer",
      value: formatNumber(customerCount),
      helper: "Unik berdasarkan email",
      href: "/admin/customers",
      icon: Users,
      tone: "bg-blue-50 text-[#173472]",
    },
    {
      label: "Pending",
      value: formatNumber(pendingOrders.length),
      helper: `Potensi ${formatCurrency(pendingPotential)}`,
      href: "/admin/orders",
      icon: AlertCircle,
      tone: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-950">
            Dashboard Admin
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Lihat Order
          </Link>
          <Link
            href="/admin/packages/new"
            className={buttonVariants({ size: "sm" })}
          >
            Tambah Paket
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label}>
              <Link href={card.href} className="block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-2 truncate text-xl font-black text-slate-950">
                      {card.value}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                      {card.helper}
                    </p>
                  </div>
                  <div
                    className={cn("grid size-9 shrink-0 place-items-center rounded-md", card.tone)}
                  >
                    <Icon aria-hidden className="size-4" />
                  </div>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Prioritas Bisnis</CardTitle>
          <CardDescription>
            Tiga sinyal cepat yang paling perlu dilihat hari ini.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 pt-0 md:grid-cols-3">
          <SignalItem
            label="Paket unggulan"
            value={bestPackage?.name ?? "Belum ada data"}
            helper={
              bestPackage
                ? `${bestPackage.orders} order, ${formatCurrency(bestPackage.revenue)}`
                : "Menunggu order success"
            }
          />
          <SignalItem
            label="Kategori terkuat"
            value={bestCategory?.name ?? "Belum ada data"}
            helper={
              bestCategory
                ? `${bestCategory.orders} order, ${formatCurrency(bestCategory.revenue)}`
                : "Menunggu order success"
            }
          />
          <SignalItem
            label="Follow up"
            value={`${formatNumber(pendingOrders.length + expiredOrders.length)} order`}
            helper={`${formatNumber(pendingOrders.length)} pending, ${formatNumber(
              expiredOrders.length,
            )} expired, ${formatNumber(cancelledOrders.length)} canceled, ${formatNumber(
              refundedOrders.length,
            )} refund`}
          />
        </CardContent>
      </Card>

      <DashboardBusinessCharts
        monthlyData={monthlyData}
        statusData={statusData}
        categoryData={categoryData}
      />

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Paket Terlaris</CardTitle>
            <CardDescription>
              Paket dengan order success terbanyak.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-0">
            {topPackages.length === 0 ? (
              <EmptyState message="Paket terlaris akan muncul setelah ada order success." />
            ) : (
              topPackages.map((item, index) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-950">
                        {index + 1}. {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatNumber(item.orders)} order success
                      </p>
                    </div>
                    <p className="shrink-0 font-black text-slate-950">
                      {formatCurrency(item.revenue)}
                    </p>
                  </div>
                  <Progress value={(item.orders / maxPackageOrders) * 100} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Promo Terpakai</CardTitle>
            <CardDescription>
              Kode promo yang menghasilkan pembayaran.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            {promoData.length === 0 ? (
              <EmptyState message="Belum ada order berbayar yang menggunakan promo." />
            ) : (
              promoData.map((promo) => (
                <div
                  key={promo.code}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-black text-[#173472]">
                      {promo.code}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatNumber(promo.orders)} order
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-700">
                    {formatCurrency(promo.revenue)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
              <CardDescription>
                Order baru dan status pembayaran terakhir.
              </CardDescription>
            </div>
            <Link
              href="/admin/orders"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Lihat semua
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        </CardHeader>
        <Separator />
        <LatestOrdersTable orders={latestOrders} />
      </Card>
    </div>
  );
}

function SignalItem({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
      <p className="mt-1 truncate text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="grid min-h-28 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
      <div>
        <PackageCheck aria-hidden className="mx-auto mb-2 size-6 text-slate-400" />
        <p className="text-sm font-semibold text-slate-500">{message}</p>
      </div>
    </div>
  );
}
