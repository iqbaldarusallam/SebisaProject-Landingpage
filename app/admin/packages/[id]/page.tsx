"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TextInput, TextArea, FormField } from "@/components/admin/FormField";
import { PACKAGE_CATEGORIES } from "@/lib/package-categories";

interface Package {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  strikePrice: number | null;
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
    strikePrice: null,
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
        throw new Error(data.message || "Gagal memuat package");
      }
      setFormData({
        name: data.data.name ?? "",
        category: data.data.category ?? "social-media-management",
        description: data.data.description ?? "",
        price: data.data.price ?? 0,
        strikePrice: data.data.strikePrice ?? null,
        duration: data.data.duration ?? "",
        features: normalizeFeatureText(data.data.features ?? ""),
        popular: data.data.popular ?? false,
        badgeType: data.data.badgeType ?? (data.data.popular ? "popular" : "none"),
        badgeText: data.data.badgeText ?? null,
        order: data.data.order ?? 0,
      });
    } catch (error) {
      console.error(error);
      setErrors({ form: "Gagal memuat package" });
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
        badgeText:
          formData.badgeType === "custom" ? formData.badgeText : null,
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
          setErrors({ form: data.message || "Gagal menyimpan package" });
        }
        return;
      }

      router.push("/admin/packages");
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
          {isEdit ? "Edit Package" : "Add New Package"}
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
          label="Package Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <FormField label="Category" error={errors.category}>
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
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          rows={4}
          required
        />

        <TextInput
          label="Price (Rp)"
          type="number"
          value={formData.price}
          onChange={(e) => handleChange("price", Number(e.target.value))}
          error={errors.price}
          required
        />

        <TextInput
          label="Strike Price / Harga Coret (Rp)"
          type="number"
          value={formData.strikePrice ?? ""}
          onChange={(e) =>
            handleChange(
              "strikePrice",
              e.target.value ? Number(e.target.value) : null,
            )
          }
          error={errors.strikePrice}
          placeholder="Kosongkan jika tidak ada harga coret"
        />

        <TextInput
          label="Duration"
          placeholder="e.g., 1 Month, 3 Months, 6 Months"
          value={formData.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          error={errors.duration}
          required
        />

        <FormField label="Badge Paket" error={errors.badgeType}>
          <select
            value={formData.badgeType ?? "none"}
            onChange={(e) =>
              handleChange(
                "badgeType",
                e.target.value as Package["badgeType"],
              )
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#173472]"
          >
            <option value="none">Tidak ada badge</option>
            <option value="popular">Popular</option>
            <option value="discount">Hemat otomatis dari harga coret</option>
            <option value="custom">Other / isi sendiri</option>
          </select>
        </FormField>

        {formData.badgeType === "custom" && (
          <TextInput
            label="Custom Badge Text"
            value={formData.badgeText ?? ""}
            onChange={(e) => handleChange("badgeText", e.target.value)}
            error={errors.badgeText}
            placeholder="Contoh: Mulai dari 300.000"
          />
        )}

        <FormField label="Features" error={errors.features}>
          <textarea
            value={formData.features ?? ""}
            onChange={(e) => handleChange("features", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173472] focus:border-transparent outline-none"
            rows={6}
            placeholder={"Landing page 1 halaman\nCopywriting penawaran\nForm guest checkout"}
          />
          <p className="text-xs text-gray-500 mt-1">
            Tulis satu fitur per baris. Tidak perlu format JSON.
          </p>
        </FormField>

        <TextInput
          label="Display Order"
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
            {submitting ? "Saving..." : "Save Package"}
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
