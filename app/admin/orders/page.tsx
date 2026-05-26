"use client";

import { useEffect, useState } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";

interface Order {
  id: number;
  transactionId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
  createdAt: string;
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

  const columns: DataTableColumn<Order>[] = [
    { key: "transactionId" as const, label: "Transaction ID" },
    { key: "customerName" as const, label: "Nama" },
    { key: "customerEmail" as const, label: "Email" },
    { key: "customerPhone" as const, label: "WA" },
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
          paid: "Paid",
          failed: "Failed",
        };
        return labels[status] || status;
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
        searchFields={(order) => [
          order.transactionId,
          order.customerName,
          order.customerEmail,
          order.customerPhone,
          order.package?.name,
          order.promo?.code,
          order.totalPrice,
          order.status,
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
          "Dibuat Pada": new Date(order.createdAt).toLocaleString("id-ID"),
        })}
      />
    </div>
  );
}
