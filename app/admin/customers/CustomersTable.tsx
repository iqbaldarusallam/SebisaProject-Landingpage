"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";

export type CustomerSummaryRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  latestOrderAt: string;
  latestPackage: string;
  latestStatus: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function CustomersTable({
  customers,
}: {
  customers: CustomerSummaryRow[];
}) {
  const columns: DataTableColumn<CustomerSummaryRow>[] = [
    { key: "name", label: "Nama" },
    { key: "email", label: "Email" },
    { key: "phone", label: "WA" },
    {
      key: "orderCount",
      label: "Order",
      render: (value, customer) => (
        <div>
          <p className="font-bold">{Number(value ?? 0)} order</p>
          <p className="text-xs text-slate-500">
            Terakhir: {customer.latestPackage}
          </p>
        </div>
      ),
    },
    {
      key: "totalSpent",
      label: "Total Belanja",
      render: (value) => formatCurrency(Number(value ?? 0)),
    },
    {
      key: "latestOrderAt",
      label: "Order Terakhir",
      render: (value) => formatDate(String(value)),
    },
    {
      key: "latestStatus",
      label: "Status",
      render: (value) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={customers}
      exportFilename="customers"
      searchPlaceholder="Cari customer..."
      filters={[
        {
          id: "status",
          label: "Status Terakhir",
          allLabel: "Semua",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Success", value: "paid" },
            { label: "Gagal", value: "failed" },
            { label: "Expired", value: "expired" },
            { label: "Refund", value: "refunded" },
            { label: "Partial Refund", value: "partial_refunded" },
            { label: "Canceled", value: "canceled" },
          ],
          getValue: (customer) => customer.latestStatus,
        },
        {
          id: "orderCount",
          label: "Jumlah Order",
          allLabel: "Semua Order",
          display: "select",
          options: [
            { label: "1 order", value: "single" },
            { label: "Repeat order", value: "repeat" },
          ],
          getValue: (customer) =>
            customer.orderCount > 1 ? "repeat" : "single",
        },
        {
          id: "period",
          label: "Periode",
          allLabel: "Semua Waktu",
          display: "select",
          options: [
            { label: "Minggu terakhir", value: "last-week" },
            { label: "Bulan terakhir", value: "last-month" },
            { label: "Tahun terakhir", value: "last-year" },
          ],
          getValue: (customer) =>
            getRelativeDateBuckets(customer.latestOrderAt),
        },
      ]}
      searchFields={(customer) => [
        customer.name,
        customer.email,
        customer.phone,
        customer.orderCount,
        customer.totalSpent,
        customer.latestPackage,
        customer.latestStatus,
        formatDate(customer.latestOrderAt),
      ]}
      exportRow={(customer) => ({
        Nama: customer.name,
        Email: customer.email,
        WA: customer.phone,
        Order: customer.orderCount,
        "Total Belanja": customer.totalSpent,
        "Paket Terakhir": customer.latestPackage,
        "Order Terakhir": formatDate(customer.latestOrderAt),
        Status: customer.latestStatus,
      })}
    />
  );
}

function getRelativeDateBuckets(date: string) {
  const value = new Date(date).getTime();
  if (!Number.isFinite(value)) return [];

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const buckets: string[] = [];

  if (value >= now - 7 * day) buckets.push("last-week");
  if (value >= now - 30 * day) buckets.push("last-month");
  if (value >= now - 365 * day) buckets.push("last-year");

  return buckets;
}
