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

interface Package {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  strikePrice?: number | null;
  popular: boolean;
  badgeType: string;
  badgeText?: string | null;
  duration?: string;
  order: number;
  createdAt: string;
}

export default function PackagesPage() {
  const router = useRouter();
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
      setError("Gagal memuat packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (pkg: Package) => {
    if (!confirm(`Delete package "${pkg.name}"?`)) return;

    try {
      const res = await fetch(`/api/packages/${pkg.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPackages(packages.filter((p) => p.id !== pkg.id));
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus package");
    }
  };

  const columns: DataTableColumn<Package>[] = [
    { key: "name" as const, label: "Name" },
    {
      key: "category" as const,
      label: "Category",
      render: (value) => getPackageCategoryTitle(String(value)),
    },
    { key: "description" as const, label: "Description" },
    {
      key: "price" as const,
      label: "Price",
      render: (value) => `Rp${Number(value).toLocaleString("id-ID")}`,
    },
    {
      key: "strikePrice" as const,
      label: "Harga Coret",
      render: (value) =>
        value ? `Rp${Number(value).toLocaleString("id-ID")}` : "-",
    },
    {
      key: "badgeType" as const,
      label: "Badge",
      render: (value, row) => getBadgeLabel(String(value), row.badgeText),
    },
    { key: "duration" as const, label: "Duration" },
    { key: "order" as const, label: "Order" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
          <p className="text-gray-600">Manage service packages</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Add Package
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
        searchPlaceholder="Cari package..."
        searchFields={(pkg) => [
          pkg.name,
          getPackageCategoryTitle(pkg.category),
          pkg.description,
          pkg.price,
          pkg.strikePrice,
          pkg.duration,
          getBadgeLabel(pkg.badgeType, pkg.badgeText),
        ]}
        exportRow={(pkg) => ({
          ID: pkg.id,
          Name: pkg.name,
          Category: getPackageCategoryTitle(pkg.category),
          Description: pkg.description,
          Price: pkg.price,
          "Harga Coret": pkg.strikePrice ?? null,
          Badge: getBadgeLabel(pkg.badgeType, pkg.badgeText),
          Duration: pkg.duration ?? "",
          Order: pkg.order,
          "Dibuat Pada": new Date(pkg.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(pkg) => router.push(`/admin/packages/${pkg.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}

function getBadgeLabel(type: string, text?: string | null) {
  if (type === "popular") return "Popular";
  if (type === "discount") return "Hemat otomatis";
  if (type === "custom") return text || "Custom";
  return "-";
}
