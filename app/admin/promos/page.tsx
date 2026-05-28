"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { useAdminToast } from "@/components/admin/AdminToast";

interface Promo {
  id: number;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  code: string;
  isActive: boolean;
  createdAt: string;
  packages?: Array<{
    packageId: number;
    package?: {
      name: string;
    };
  }>;
}

export default function PromosPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/promos");
        const data = await res.json();
        setPromos(
          (data.data || []).filter(
            (promo: Promo) => !promo.code.startsWith("AUTO-"),
          ),
        );
      } catch (error) {
        console.error(error);
        setError("Gagal memuat promos");
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const handleDelete = async (promo: Promo) => {
    try {
      const res = await fetch(`/api/promos/${promo.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Gagal menghapus promo");
      }

      setPromos(promos.filter((p) => p.id !== promo.id));
      showToast({
        title: "Kupon promo berhasil dihapus",
        message: `${promo.name} sudah dihapus dari daftar promo.`,
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Kupon promo gagal dihapus",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus promo.",
        variant: "error",
      });
    }
  };

  const columns: DataTableColumn<Promo>[] = [
    { key: "name" as const, label: "Name" },
    { key: "code" as const, label: "Code" },
    { key: "discountType" as const, label: "Type" },
    {
      key: "discountValue" as const,
      label: "Value",
      render: (v, row) => {
        const num = Number(v) || 0;
        return row.discountType === "percentage" ? `${num}%` : `Rp ${num}`;
      },
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (v) => (Boolean(v) ? "Active" : "Inactive"),
    },
    {
      key: "packages" as const,
      label: "Paket",
      render: (_value, row) =>
        row.packages?.length
          ? row.packages
              .map((item) => item.package?.name)
              .filter(Boolean)
              .join(", ")
          : "Semua paket",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promos</h1>
          <p className="text-gray-600">Manage promotional campaigns</p>
        </div>
        <Link
          href="/admin/promos/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Add Kupon Promo
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={promos}
        loading={loading}
        exportFilename="promos"
        searchPlaceholder="Cari promo..."
        searchFields={(promo) => [
          promo.name,
          promo.code,
          promo.description,
          promo.discountType,
          promo.discountValue,
          promo.isActive ? "Active" : "Inactive",
          promo.packages?.length
            ? promo.packages
                .map((item) => item.package?.name)
                .filter(Boolean)
                .join(", ")
            : "Semua paket",
        ]}
        exportRow={(promo) => ({
          ID: promo.id,
          Name: promo.name,
          Code: promo.code,
          Description: promo.description,
          Type: promo.discountType,
          Value:
            promo.discountType === "percentage"
              ? `${promo.discountValue}%`
              : promo.discountValue,
          Status: promo.isActive ? "Active" : "Inactive",
          Paket: promo.packages?.length
            ? promo.packages
                .map((item) => item.package?.name)
                .filter(Boolean)
                .join(", ")
            : "Semua paket",
          "Dibuat Pada": new Date(promo.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(promo) => router.push(`/admin/promos/${promo.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
