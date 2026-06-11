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

interface Service {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.data || []);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat layanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Gagal menghapus layanan");
      }

      setServices((current) =>
        current.filter((item) => item.id !== service.id),
      );
      showToast({
        title: "Layanan berhasil dihapus",
        message: `${service.title} sudah dihapus dari CMS.`,
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Layanan gagal dihapus",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus layanan.",
        variant: "error",
      });
    }
  };

  const columns: DataTableColumn<Service>[] = [
    {
      key: "displayOrder" as const,
      label: "Urutan",
      render: (value) => (
        <span className="font-bold text-slate-700">{String(value)}</span>
      ),
    },
    {
      key: "title" as const,
      label: "Nama Layanan",
      render: (value) => (
        <span className="font-semibold text-slate-900">{String(value)}</span>
      ),
    },
    {
      key: "description" as const,
      label: "Deskripsi",
      render: (value) => (
        <span className="block max-w-xl whitespace-normal text-slate-600">
          {String(value)}
        </span>
      ),
    },
    {
      key: "isActive" as const,
      label: "Status",
      render: (value) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            value
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {value ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Layanan</h1>
          <p className="text-gray-600">
            Kelola daftar layanan yang tampil di section Layanan Kami.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Tambah Layanan
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        exportFilename="layanan"
        searchPlaceholder="Cari layanan..."
        searchFields={(service) => [
          service.id,
          service.title,
          service.description,
          service.displayOrder,
          service.isActive,
        ]}
        exportRow={(service) => ({
          ID: service.id,
          "Nama Layanan": service.title,
          Deskripsi: service.description,
          Urutan: service.displayOrder,
          Status: service.isActive ? "Aktif" : "Nonaktif",
          "Dibuat Pada": new Date(service.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(service) => router.push(`/admin/services/${service.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}
