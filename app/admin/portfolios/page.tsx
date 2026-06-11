"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";
import { useAdminToast } from "@/components/admin/AdminToast";

interface Portfolio {
  id: number;
  brand: string;
  image: string;
  createdAt: string;
}

export default function PortfoliosPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/portfolios");
      const data = await res.json();
      setPortfolios(data.data || []);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat portofolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async (portfolio: Portfolio) => {
    try {
      const res = await fetch(`/api/portfolios/${portfolio.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Gagal menghapus portofolio");
      }

      setPortfolios((current) =>
        current.filter((item) => item.id !== portfolio.id),
      );
      showToast({
        title: "Portofolio berhasil dihapus",
        message: `Portofolio ${portfolio.brand} sudah dihapus.`,
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Portofolio gagal dihapus",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus portofolio.",
        variant: "error",
      });
    }
  };

  const columns: DataTableColumn<Portfolio>[] = [
    {
      key: "image" as const,
      label: "Foto",
      render: (value, row) => (
        <div
          aria-label={`Portofolio ${row.id}`}
          className="h-20 w-16 rounded bg-slate-100 bg-cover bg-center ring-1 ring-slate-200"
          style={{ backgroundImage: `url("${String(value)}")` }}
        />
      ),
    },
    {
      key: "brand" as const,
      label: "Nama Brand",
      render: (value) => (
        <span className="font-semibold text-slate-900">{String(value)}</span>
      ),
    },
    {
      key: "createdAt" as const,
      label: "Dibuat",
      render: (value) => new Date(String(value)).toLocaleDateString("id-ID"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portofolio</h1>
          <p className="text-gray-600">
            Kelola foto portofolio yang tampil di landing page.
          </p>
        </div>
        <Link
          href="/admin/portfolios/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Tambah Foto
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={portfolios}
        loading={loading}
        exportFilename="portofolio"
        searchPlaceholder="Cari brand atau portofolio..."
        searchFields={(portfolio) => [
          portfolio.id,
          portfolio.brand,
          portfolio.image,
        ]}
        exportRow={(portfolio) => ({
          ID: portfolio.id,
          Brand: portfolio.brand,
          Image: portfolio.image,
          "Dibuat Pada": new Date(portfolio.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(portfolio) => router.push(`/admin/portfolios/${portfolio.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
