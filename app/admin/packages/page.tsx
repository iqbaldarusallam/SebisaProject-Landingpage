"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";
import { getPackageCategoryTitle } from "@/lib/package-categories";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { useAdminToast } from "@/components/admin/AdminToast";

interface Package {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  salePrice?: number | null;
  popular: boolean;
  badgeType: string;
  badgeText?: string | null;
  duration?: string;
  order: number;
  createdAt: string;
}

export default function PackagesPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/packages");
      const data = await res.json();
      setPackages(data.data || []);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat paket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (pkg: Package) => {
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Gagal menghapus paket");
      }

      setPackages(packages.filter((p) => p.id !== pkg.id));
      showToast({
        title: "Paket berhasil dihapus",
        message: `${pkg.name} sudah dihapus dari katalog.`,
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Paket gagal dihapus",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus paket.",
        variant: "error",
      });
    }
  };

  const columns: DataTableColumn<Package>[] = [
    { key: "name" as const, label: "Nama" },
    {
      key: "category" as const,
      label: "Kategori",
      render: (value) => getPackageCategoryTitle(String(value)),
    },
    { key: "description" as const, label: "Deskripsi" },
    {
      key: "price" as const,
      label: "Harga Normal",
      render: (value) => `Rp${Number(value).toLocaleString("id-ID")}`,
    },
    {
      key: "salePrice" as const,
      label: "Harga Promo",
      render: (value) =>
        value ? `Rp${Number(value).toLocaleString("id-ID")}` : "-",
    },
    {
      key: "badgeType" as const,
      label: "Badge",
      render: (value, row) => getBadgeLabel(String(value), row.badgeText),
    },
    { key: "duration" as const, label: "Durasi" },
    { key: "order" as const, label: "Urutan" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paket</h1>
          <p className="text-gray-600">Kelola paket layanan</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Tambah Paket
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={packages}
        loading={loading}
        exportFilename="packages"
        searchPlaceholder="Cari paket..."
        searchFields={(pkg) => [
          pkg.name,
          getPackageCategoryTitle(pkg.category),
          pkg.description,
          pkg.price,
          pkg.salePrice,
          pkg.duration,
          pkg.order,
          getBadgeLabel(pkg.badgeType, pkg.badgeText),
        ]}
        exportRow={(pkg) => ({
          ID: pkg.id,
          Nama: pkg.name,
          Kategori: getPackageCategoryTitle(pkg.category),
          Deskripsi: pkg.description,
          "Harga Normal": pkg.price,
          "Harga Promo": pkg.salePrice ?? null,
          Badge: getBadgeLabel(pkg.badgeType, pkg.badgeText),
          Durasi: pkg.duration ?? "",
          Urutan: pkg.order,
          "Dibuat Pada": new Date(pkg.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(pkg) => router.push(`/admin/packages/${pkg.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}

function getBadgeLabel(type: string, text?: string | null) {
  if (type === "popular") return "Populer";
  if (type === "discount") return "Hemat";
  if (type === "custom") return text || "Kustom";
  return "-";
}
