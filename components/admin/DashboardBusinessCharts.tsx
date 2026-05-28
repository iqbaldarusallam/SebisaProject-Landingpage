"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type TrendPoint = {
  month: string;
  revenue: number;
  orders: number;
};

type StatusPoint = {
  status: string;
  label: string;
  value: number;
  percent: number;
  color: string;
};

type CategoryPoint = {
  name: string;
  revenue: number;
  orders: number;
};

type DashboardBusinessChartsProps = {
  monthlyData: TrendPoint[];
  statusData: StatusPoint[];
  categoryData: CategoryPoint[];
};

const revenueConfig = {
  revenue: {
    label: "Pendapatan",
    color: "#173472",
  },
  orders: {
    label: "Order",
    color: "#F59E0B",
  },
} satisfies ChartConfig;

const categoryConfig = {
  revenue: {
    label: "Pendapatan",
    color: "#06B6D4",
  },
} satisfies ChartConfig;

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
  if (value >= 1_000) return `Rp ${Math.round(value / 1_000)} rb`;
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function DashboardBusinessCharts({
  monthlyData,
  statusData,
  categoryData,
}: DashboardBusinessChartsProps) {
  const hasMonthlyData = monthlyData.some(
    (item) => item.revenue > 0 || item.orders > 0,
  );
  const hasStatusData = statusData.some((item) => item.value > 0);
  const hasCategoryData = categoryData.some((item) => item.revenue > 0);

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-7">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Tren Pendapatan</CardTitle>
          <CardDescription>Order success dalam 6 bulan terakhir.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasMonthlyData ? (
            <ChartContainer config={revenueConfig} className="h-64 w-full">
              <AreaChart data={monthlyData} margin={{ left: 0, right: 8 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#173472" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#173472" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrency}
                  width={72}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      valueFormatter={(value, key) =>
                        key === "revenue"
                          ? formatCurrency(value)
                          : `${value.toLocaleString("id-ID")} order`
                      }
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#173472"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <EmptyChart message="Tren muncul setelah ada order success." />
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-5">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Status Order</CardTitle>
          <CardDescription>Komposisi seluruh transaksi.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasStatusData ? (
            <ChartContainer config={{}} className="h-64 w-full">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={54}
                  outerRadius={88}
                  paddingAngle={4}
                >
                  {statusData.map((item) => (
                    <Cell key={item.status} fill={item.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      valueFormatter={(value) =>
                        `${value.toLocaleString("id-ID")} order`
                      }
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <EmptyChart message="Status muncul setelah ada transaksi." />
          )}
          {statusData.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-600">
                    {item.label} {Math.round(item.percent)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="xl:col-span-12">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">Pendapatan per Kategori</CardTitle>
          <CardDescription>
            Kategori layanan yang paling menghasilkan dari order success.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {hasCategoryData ? (
            <ChartContainer config={categoryConfig} className="h-72 w-full">
              <BarChart data={categoryData} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrency}
                  width={72}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      valueFormatter={(value) => formatCurrency(value)}
                    />
                  }
                />
                <Bar
                  dataKey="revenue"
                  fill="#06B6D4"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <EmptyChart message="Kategori muncul setelah ada order success." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="grid h-56 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}
