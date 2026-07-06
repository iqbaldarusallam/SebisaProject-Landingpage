"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createOrderFollowUpWhatsappUrl } from "@/lib/order-follow-up";

export type LatestOrderRow = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  followedUpAt: string | null;
  package: {
    name: string | null;
  } | null;
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  paid: "Success",
  failed: "Gagal",
  expired: "Expired",
  refunded: "Refund",
  partial_refunded: "Partial Refund",
  canceled: "Canceled",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusVariant(status: string): BadgeProps["variant"] {
  if (status === "paid") return "success";
  if (status === "pending") return "warning";
  if (status === "failed" || status === "expired" || status === "canceled") {
    return "destructive";
  }
  return "secondary";
}

export function LatestOrdersTable({ orders }: { orders: LatestOrderRow[] }) {
  const [rows, setRows] = useState(orders);

  const markFollowedUp = async (order: LatestOrderRow) => {
    const followedUpAt = new Date().toISOString();
    setRows((current) =>
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
      setRows((current) =>
        current.map((item) =>
          item.id === order.id
            ? { ...item, followedUpAt: order.followedUpAt }
            : item,
        ),
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Paket</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Follow Up</th>
            <th className="px-4 py-3">Tanggal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>
                Belum ada transaksi.
              </td>
            </tr>
          ) : (
            rows.map((order) => {
              const whatsappUrl = createOrderFollowUpWhatsappUrl(order);

              return (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {order.package?.name ?? "Paket sudah dihapus"}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusVariant(order.status)}>
                      {statusLabels[order.status] ?? order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {order.followedUpAt ? (
                      <span className="inline-flex min-h-8 items-center gap-1.5 rounded-md bg-emerald-50 px-3 text-xs font-bold text-emerald-700">
                        <CheckCircle2 aria-hidden className="size-4" />
                        Sudah
                      </span>
                    ) : whatsappUrl ? (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => markFollowedUp(order)}
                        className={buttonVariants({
                          size: "sm",
                          className:
                            "min-h-8 bg-emerald-600 px-3 text-xs hover:bg-emerald-700",
                        })}
                      >
                        <FaWhatsapp aria-hidden />
                        WhatsApp
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
