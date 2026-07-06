"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextArea, TextInput } from "@/components/admin/FormField";
import { setAdminToastFlash } from "@/components/admin/AdminToast";

interface Service {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export default function ServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEdit = serviceId !== "new";

  const [formData, setFormData] = useState<Partial<Service>>({
    title: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || !serviceId) return;

    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Gagal memuat layanan");
        }

        setFormData({
          title: data.data.title ?? "",
          description: data.data.description ?? "",
          displayOrder: data.data.displayOrder ?? 0,
          isActive: data.data.isActive ?? true,
        });
      } catch (error) {
        console.error(error);
        setErrors({ form: "Gagal memuat layanan" });
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [isEdit, serviceId]);

  const handleChange = (
    field: keyof Service,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/services/${serviceId}` : "/api/services";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.message || "Gagal menyimpan layanan" });
        return;
      }

      setAdminToastFlash({
        title: isEdit
          ? "Layanan berhasil diperbarui"
          : "Layanan berhasil dibuat",
        message: `${formData.title || "Layanan"} sudah tersimpan.`,
      });
      router.push("/admin/services");
    } catch (error) {
      console.error(error);
      setErrors({ form: "Terjadi kesalahan saat menyimpan layanan" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? "Edit Layanan" : "Tambah Layanan"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow"
      >
        {errors.form && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        {isEdit && (
          <TextInput label="Layanan ID" value={serviceId ?? ""} disabled />
        )}

        <TextInput
          label="Nama Layanan"
          value={formData.title ?? ""}
          onChange={(event) => handleChange("title", event.target.value)}
          error={errors.title}
          placeholder="Contoh: Merchandise Kaos, Tumbler & Souvenir Brand"
          required
        />

        <TextArea
          label="Deskripsi Layanan"
          value={formData.description ?? ""}
          onChange={(event) => handleChange("description", event.target.value)}
          error={errors.description}
          rows={8}
          maxLength={1200}
          required
        />
        <p className="-mt-4 text-xs text-slate-500">
          {(formData.description ?? "").length}/1200 karakter
        </p>

        <TextInput
          label="Urutan Tampil"
          type="number"
          min="0"
          value={formData.displayOrder ?? 0}
          onChange={(event) =>
            handleChange("displayOrder", Number(event.target.value))
          }
          error={errors.displayOrder}
          required
        />

        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={Boolean(formData.isActive)}
            onChange={(event) => handleChange("isActive", event.target.checked)}
            className="size-4 accent-[#173472]"
          />
          <span>
            <span className="block text-sm font-bold text-slate-800">
              Aktifkan layanan
            </span>
            <span className="text-xs text-slate-500">
              Jika nonaktif, layanan tidak akan tampil di halaman publik.
            </span>
          </span>
        </label>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#173472] px-6 py-2 text-white transition-colors hover:bg-[#131C36] disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan Layanan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg bg-gray-300 px-6 py-2 text-gray-900 transition-colors hover:bg-gray-400"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
