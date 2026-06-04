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

interface Testimonial {
  id: number;
  name: string;
  brand: string;
  content: string;
  rating: number;
  createdAt: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error(error);
      setError("Gagal memuat testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (testimonial: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Gagal menghapus testimoni");
      }

      setTestimonials(testimonials.filter((t) => t.id !== testimonial.id));
      showToast({
        title: "Testimoni berhasil dihapus",
        message: `Testimoni dari ${testimonial.name} sudah dihapus.`,
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Testimoni gagal dihapus",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus testimoni.",
        variant: "error",
      });
    }
  };

  const columns: DataTableColumn<Testimonial>[] = [
    { key: "id" as const, label: "Testimoni ID" },
    { key: "name" as const, label: "Nama" },
    { key: "brand" as const, label: "Brand / Jabatan" },
    {
      key: "rating" as const,
      label: "Rating",
      render: (value) => `Rating ${Number(value).toLocaleString("id-ID")}/5`,
    },
    {
      key: "content" as const,
      label: "Content",
      render: (value) => (
        <span className="block max-w-md whitespace-normal">
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">
            Kelola testimoni, brand, rating, dan content dari satu tempat.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#173472] px-4 py-2 text-white transition-colors hover:bg-[#131C36]"
        >
          <FiPlus aria-hidden />
          Add Testimonial
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={testimonials}
        loading={loading}
        exportFilename="testimonials"
        searchPlaceholder="Cari testimonial..."
        searchFields={(testimonial) => [
          testimonial.id,
          testimonial.name,
          testimonial.brand,
          testimonial.rating,
          testimonial.content,
        ]}
        exportRow={(testimonial) => ({
          ID: testimonial.id,
          Nama: testimonial.name,
          "Brand / Jabatan": testimonial.brand,
          Rating: testimonial.rating,
          Content: testimonial.content,
          "Dibuat Pada": new Date(testimonial.createdAt).toLocaleString("id-ID"),
        })}
        onEdit={(testimonial) =>
          router.push(`/admin/testimonials/${testimonial.id}`)
        }
        onDelete={handleDelete}
      />
    </div>
  );
}
