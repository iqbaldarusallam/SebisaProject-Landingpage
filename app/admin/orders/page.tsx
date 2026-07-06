"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";
import { createOrderFollowUpWhatsappUrl } from "@/lib/order-follow-up";

interface Order {
  id: number;
  transactionId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  followedUpAt?: string | null;
  package?: {
    name: string;
  };
  promo?: {
    code: string;
  } | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error(error);
        setError("Gagal memuat orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleFollowUpClick = async (order: Order) => {
    const followedUpAt = new Date().toISOString();
    setOrders((current) =>
      current.map((item) =>
        item.id === order.id ? { ...item, followedUpAt } : item,
      ),
    );

    try {
      const response = await fetch(`/api/orders/${order.id}/follow-up`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Gagal update follow up");
    } catch (error) {
      console.error(error);
      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? { ...item, followedUpAt: order.followedUpAt }
            : item,
        ),
      );
    }
  };

  const columns: DataTableColumn<Order>[] = [
    { key: "transactionId" as const, label: "Transaction ID" },
    { key: "customerName" as const, label: "Nama" },
    { key: "customerEmail" as const, label: "Email" },
    {
      key: "customerPhone" as const,
      label: "WA",
      render: (value, row) => {
        const whatsappUrl = createOrderFollowUpWhatsappUrl(row);

        return (
          <div className="flex min-w-44 items-center gap-2">
            <span>{String(value ?? "-")}</span>
            {row.followedUpAt ? (
              <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-emerald-50 px-3 text-xs font-bold text-emerald-700">
                <CheckCircle2 aria-hidden className="size-4" />
                Sudah
              </span>
            ) : whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleFollowUpClick(row)}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700"
              >
                <FaWhatsapp aria-hidden />
                WhatsApp
              </a>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "package" as const,
      label: "Paket",
      render: (_value, row) => (
        <div className="min-w-44 whitespace-normal">
          <p>{row.package?.name ?? "-"}</p>
          {row.promo?.code && (
            <p className="mt-1 text-xs font-semibold text-green-700">
              Promo: {row.promo.code}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "totalPrice" as const,
      label: "Amount",
      render: (value) => `Rp ${Number(value ?? 0).toLocaleString("id-ID")}`,
    },
    {
      key: "status" as const,
      label: "Status",
      render: (value) => {
        const status = String(value ?? "");
        const labels: Record<string, string> = {
          pending: "Pending",
          paid: "Success",
          failed: "Gagal",
          expired: "Expired",
          refunded: "Refund",
          partial_refunded: "Partial Refund",
          canceled: "Canceled",
        };
        const colorClass: Record<string, string> = {
          pending: "bg-amber-50 text-amber-700 ring-amber-100",
          paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
          failed: "bg-red-50 text-red-700 ring-red-100",
          expired: "bg-slate-100 text-slate-700 ring-slate-200",
          refunded: "bg-sky-50 text-sky-700 ring-sky-100",
          partial_refunded: "bg-sky-50 text-sky-700 ring-sky-100",
          canceled: "bg-rose-50 text-rose-700 ring-rose-100",
        };
        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
              colorClass[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"
            }`}
          >
            {labels[status] || status}
          </span>
        );
      },
    },
    {
      key: "createdAt" as const,
      label: "Created At",
      render: (value) => new Date(String(value ?? "")).toLocaleString("id-ID"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">
          Lihat order beserta data customer dan pembayaran.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        exportFilename="orders"
        searchPlaceholder="Cari order..."
        filters={[
          {
            id: "status",
            label: "Status Order",
            allLabel: "Semua",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Success", value: "paid" },
              { label: "Gagal", value: "failed" },
              { label: "Expired", value: "expired" },
              { label: "Refund", value: "refunded" },
            ],
            getValue: (order) => order.status,
          },
          {
            id: "package",
            label: "Paket",
            allLabel: "Semua Paket",
            display: "select",
            options: getUniqueOptions(
              orders.map((order) => order.package?.name ?? "Paket dihapus"),
            ),
            getValue: (order) => order.package?.name ?? "Paket dihapus",
          },
          {
            id: "promo",
            label: "Promo",
            allLabel: "Semua Promo",
            display: "select",
            options: [
              { label: "Tanpa promo", value: "tanpa-promo" },
              ...getUniqueOptions(
                orders
                  .map((order) => order.promo?.code)
                  .filter((code): code is string => Boolean(code)),
              ),
            ],
            getValue: (order) => order.promo?.code ?? "tanpa-promo",
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
            getValue: (order) => getRelativeDateBuckets(order.createdAt),
          },
        ]}
        searchFields={(order) => [
          order.id,
          order.transactionId,
          order.customerName,
          order.customerEmail,
          order.customerPhone,
          order.package?.name,
          order.promo?.code,
          order.totalPrice,
          order.status,
          order.followedUpAt ? "Sudah follow up" : "Belum follow up",
          new Date(order.createdAt).toLocaleString("id-ID"),
        ]}
        exportRow={(order) => ({
          ID: order.id,
          "Transaction ID": order.transactionId ?? "",
          Nama: order.customerName,
          Email: order.customerEmail,
          WA: order.customerPhone,
          Paket: order.package?.name ?? "",
          Promo: order.promo?.code ?? "",
          Amount: order.totalPrice,
          Status: order.status,
          "Follow Up": order.followedUpAt ? "Sudah" : "Belum",
          "Dibuat Pada": new Date(order.createdAt).toLocaleString("id-ID"),
        })}
      />
    </div>
  );
}

function getUniqueOptions(values: string[]) {
  return Array.from(new Set(values))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((value) => ({ label: value, value }));
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
