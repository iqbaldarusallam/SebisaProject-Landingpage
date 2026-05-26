"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";

interface Promo {
  id: number;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  code: string;
  isActive: boolean;
  createdAt: string;
}

export default function PromosPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/promos");
        const data = await res.json();
        setPromos(data.data || []);
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
    if (!confirm(`Delete promo "${promo.name}"?`)) return;

    try {
      const res = await fetch(`/api/promos/${promo.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPromos(promos.filter((p) => p.id !== promo.id));
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus promo");
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
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Add Promo
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
          "Dibuat Pada": new Date(promo.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(promo) => router.push(`/admin/promos/${promo.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
