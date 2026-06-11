"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextInput } from "@/components/admin/FormField";
import {
  setAdminToastFlash,
  useAdminToast,
} from "@/components/admin/AdminToast";

interface Portfolio {
  id: number;
  brand: string;
  image: string;
}

export default function PortfolioFormPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const params = useParams();
  const portfolioId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEdit = portfolioId !== "new";

  const [formData, setFormData] = useState<Partial<Portfolio>>({
    brand: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit || !portfolioId) return;

    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolios/${portfolioId}`);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Gagal memuat portofolio");
        }

        setFormData({
          brand: data.data.brand ?? "",
          image: data.data.image ?? "",
        });
      } catch (error) {
        console.error(error);
        setErrors({ form: "Gagal memuat portofolio" });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [isEdit, portfolioId]);

  const handleChange = (field: keyof Portfolio, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: "" }));

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/uploads/portfolio-image", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json().catch(() => ({
        ok: false,
        message: "Response upload tidak valid",
      }));

      if (!res.ok || !data.ok) {
        setErrors((prev) => ({
          ...prev,
          image:
            data.message ||
            `Gagal upload gambar portofolio (status ${res.status})`,
        }));
        return;
      }

      handleChange("image", data.data.url);
      showToast({
        title: "Foto berhasil diupload",
        message: "URL Cloudinary sudah otomatis masuk ke form.",
      });
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        image: "Gagal menghubungi Cloudinary",
      }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/portfolios/${portfolioId}`
        : "/api/portfolios";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.message || "Gagal menyimpan portofolio" });
        return;
      }

      setAdminToastFlash({
        title: isEdit
          ? "Portofolio berhasil diperbarui"
          : "Portofolio berhasil dibuat",
        message: `Portofolio ${formData.brand} sudah tersimpan.`,
      });
      router.push("/admin/portfolios");
    } catch (error) {
      console.error(error);
      setErrors({ form: "Terjadi kesalahan" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? "Edit Portofolio" : "Tambah Foto Portofolio"}
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

        <TextInput
          label="Nama Brand / Client"
          value={formData.brand ?? ""}
          onChange={(event) => handleChange("brand", event.target.value)}
          error={errors.brand}
          placeholder="Contoh: Capung Mitra Mulia"
          required
        />

        <TextInput
          label="Cloudinary Image URL"
          value={formData.image ?? ""}
          readOnly
          placeholder="Upload foto portofolio untuk mengisi URL"
          required
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Upload Foto Portofolio<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading || submitting}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#173472] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white disabled:opacity-50"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Database hanya menyimpan URL Cloudinary. Rekomendasi ukuran foto:
            479 x 836 px. Untuk hasil lebih tajam, gunakan 958 x 1672 px atau
            ukuran vertikal lain dengan rasio yang sama.
          </p>
          {uploading && (
            <p className="mt-2 text-sm font-medium text-[#173472]">
              Mengupload ke Cloudinary...
            </p>
          )}
        </div>

        {formData.image && (
          <div
            aria-label="Preview portofolio"
            className="h-80 w-56 rounded-lg border border-slate-200 bg-slate-50 bg-cover bg-center"
            style={{ backgroundImage: `url("${formData.image}")` }}
          />
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="rounded-lg bg-[#173472] px-6 py-2 text-white transition-colors hover:bg-[#131C36] disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan Portofolio"}
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
