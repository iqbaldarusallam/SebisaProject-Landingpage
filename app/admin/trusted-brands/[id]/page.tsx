"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TextInput } from "@/components/admin/FormField";

interface TrustedBrand {
  id: number;
  brand: string;
  image: string;
}

export default function TrustedBrandFormPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEdit = brandId !== "new";

  const [formData, setFormData] = useState<Partial<TrustedBrand>>({
    brand: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit || !brandId) return;

    const fetchBrand = async () => {
      try {
        const res = await fetch(`/api/trusted-brands/${brandId}`);
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Gagal memuat brand logo");
        }
        setFormData({
          brand: data.data.brand ?? "",
          image: data.data.image ?? "",
        });
      } catch (error) {
        console.error(error);
        setErrors({ form: "Gagal memuat brand logo" });
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [isEdit, brandId]);

  const handleChange = (field: keyof TrustedBrand, value: string) => {
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

      const res = await fetch("/api/uploads/trusted-brand-logo", {
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
            `Gagal upload logo brand (status ${res.status})`,
        }));
        return;
      }

      handleChange("image", data.data.url);
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
        ? `/api/trusted-brands/${brandId}`
        : "/api/trusted-brands";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.message || "Gagal menyimpan brand logo" });
        return;
      }

      router.push("/admin/trusted-brands");
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
          {isEdit ? "Edit Brand Logo" : "Add New Brand Logo"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        {errors.form && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        <TextInput
          label="Brand"
          value={formData.brand ?? ""}
          onChange={(e) => handleChange("brand", e.target.value)}
          error={errors.brand}
          required
        />

        <TextInput
          label="Cloudinary Image URL"
          value={formData.image ?? ""}
          readOnly
          placeholder="Upload gambar brand untuk mengisi URL"
          required
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Upload Logo Brand<span className="text-red-500">*</span>
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
            Gambar diupload ke Cloudinary, database hanya menyimpan URL
            Cloudinary.
          </p>
          {uploading && (
            <p className="mt-2 text-sm font-medium text-[#173472]">
              Mengupload ke Cloudinary...
            </p>
          )}
        </div>

        {formData.image && (
          <div
            aria-label={formData.brand ?? "Brand preview"}
            className="h-20 w-40 rounded-lg border border-slate-200 bg-slate-50 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${formData.image}")` }}
          />
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#173472] text-white px-6 py-2 rounded-lg hover:bg-[#131C36] transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Brand Logo"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
