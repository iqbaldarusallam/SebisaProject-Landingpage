"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TextInput, TextArea, FormField } from "@/components/admin/FormField";
import { setAdminToastFlash } from "@/components/admin/AdminToast";
import { PACKAGE_CATEGORIES } from "@/lib/package-categories";

interface Package {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  salePrice: number | null;
  duration: string;
  features: string;
  popular: boolean;
  badgeType: "none" | "popular" | "discount" | "custom";
  badgeText: string | null;
  order: number;
}

export default function PackageFormPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEdit = packageId !== "new";

  const [formData, setFormData] = useState<Partial<Package>>({
    name: "",
    category: "social-media-management",
    description: "",
    price: 0,
    salePrice: null,
    duration: "",
    features: "",
    popular: false,
    badgeType: "none",
    badgeText: null,
    order: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const fetchPackage = useCallback(async () => {
    if (!packageId) return;

    try {
      const res = await fetch(`/api/packages/${packageId}`);
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Gagal memuat paket");
      }
      setFormData({
        name: data.data.name ?? "",
        category: data.data.category ?? "social-media-management",
        description: data.data.description ?? "",
        price: data.data.price ?? 0,
        salePrice: data.data.salePrice ?? null,
        duration: data.data.duration ?? "",
        features: normalizeFeatureText(data.data.features ?? ""),
        popular: data.data.popular ?? false,
        badgeType:
          data.data.badgeType ?? (data.data.popular ? "popular" : "none"),
        badgeText: data.data.badgeText ?? null,
        order: data.data.order ?? 0,
      });
    } catch (error) {
      console.error(error);
      setErrors({ form: "Gagal memuat paket" });
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    if (isEdit) {
      fetchPackage();
    }
  }, [fetchPackage, isEdit]);

  const handleChange = (
    field: keyof Package,
    value: string | number | boolean | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/packages/${packageId}` : "/api/packages";
      const payload = {
        ...formData,
        popular: formData.badgeType === "popular",
        badgeText: formData.badgeType === "custom" ? formData.badgeText : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.message || "Gagal menyimpan paket" });
        }
        return;
      }

      setAdminToastFlash({
        title: isEdit ? "Paket berhasil diperbarui" : "Paket berhasil dibuat",
        message: `${formData.name || "Data paket"} sudah tersimpan di katalog.`,
      });
      router.push("/admin/packages");
    } catch (error) {
      console.error(error);
      setErrors({ form: "Terjadi kesalahan" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Memuat...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? "Edit Paket" : "Tambah Paket"}
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
          label="Nama Paket"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <FormField label="Kategori" error={errors.category}>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#173472]"
            required
          >
            {PACKAGE_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </FormField>

        <TextArea
          label="Deskripsi"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          rows={4}
          required
        />

        <TextInput
          label="Harga Normal (Rp)"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
          error={errors.price}
          required
        />

        <TextInput
          label="Harga Promo (Rp)"
          type="number"
          value={formData.salePrice ?? ""}
          onChange={(e) =>
            handleChange(
              "salePrice",
              e.target.value ? Number(e.target.value) : null,
            )
          }
          error={errors.salePrice}
          placeholder="Kosongkan jika tidak ada harga promo"
        />

        <TextInput
          label="Durasi"
          placeholder="Contoh: 1 bulan, 7 hari kerja"
          value={formData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          error={errors.duration}
        />

        <FormField label="Badge Paket" error={errors.badgeType}>
          <select
            value={formData.badgeType ?? "none"}
            onChange={(e) =>
              handleChange("badgeType", e.target.value as Package["badgeType"])
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#173472]"
          >
            <option value="none">Tidak ada badge</option>
            <option value="popular">Populer</option>
            <option value="discount">Hemat dari sale price</option>
            <option value="custom">Isi sendiri</option>
          </select>
        </FormField>

        {formData.badgeType === "custom" && (
          <TextInput
            label="Teks Badge Custom"
            value={formData.badgeText ?? ""}
            onChange={(e) => handleChange("badgeText", e.target.value)}
            error={errors.badgeText}
            placeholder="Contoh: Mulai dari 300.000"
          />
        )}

        <FormField label="Fitur Paket" error={errors.features}>
          <textarea
            value={formData.features ?? ""}
            onChange={(e) => handleChange("features", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173472] focus:border-transparent outline-none"
            rows={6}
            placeholder={
              "Landing page 1 halaman\nCopywriting penawaran\nForm guest checkout"
            }
          />
        </FormField>

        <TextInput
          label="Urutan Tampil"
          type="number"
          value={formData.order}
          onChange={(e) => handleChange("order", Number(e.target.value))}
          error={errors.order}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#173472] text-white px-6 py-2 rounded-lg hover:bg-[#131C36] transition-colors disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan Paket"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

function normalizeFeatureText(features: string) {
  const trimmed = features.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed.map(String).join("\n") : trimmed;
  } catch {
    return trimmed;
  }
}
