"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/admin/DataTable";

interface TrustedBrand {
  id: number;
  brand: string;
  image: string;
  createdAt: string;
}

export default function TrustedBrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<TrustedBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trusted-brands");
      const data = await res.json();
      setBrands(data.data || []);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat brand logos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (brand: TrustedBrand) => {
    if (!confirm(`Delete brand logo "${brand.brand}"?`)) return;

    try {
      const res = await fetch(`/api/trusted-brands/${brand.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setBrands(brands.filter((item) => item.id !== brand.id));
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus brand logo");
    }
  };

  const columns: DataTableColumn<TrustedBrand>[] = [
    {
      key: "image" as const,
      label: "Gambar",
      render: (value, row) => (
        <div
          aria-label={row.brand}
          className="h-10 w-24 rounded bg-slate-100 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${String(value)}")` }}
        />
      ),
    },
    { key: "brand" as const, label: "Brand" },
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
          <h1 className="text-3xl font-bold text-gray-900">Brand Logos</h1>
          <p className="text-gray-600">
            Kelola gambar brand untuk bagian Dipercaya Oleh.
          </p>
        </div>
        <Link
          href="/admin/trusted-brands/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Add Brand Logo
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={brands}
        loading={loading}
        exportFilename="brand-logos"
        searchPlaceholder="Cari brand logo..."
        searchFields={(brand) => [brand.brand, brand.image]}
        exportRow={(brand) => ({
          ID: brand.id,
          Brand: brand.brand,
          Image: brand.image,
          "Dibuat Pada": new Date(brand.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(brand) => router.push(`/admin/trusted-brands/${brand.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
