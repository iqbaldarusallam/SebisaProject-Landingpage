"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  TextInput,
  TextArea,
  Select,
  FormField,
} from "@/components/admin/FormField";

interface Promo {
  id: number;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  code: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  packageIds: number[];
}

type PromoValue = string | number | boolean | number[];

export default function PromoFormPage() {
  const router = useRouter();
  const params = useParams();

  const promoId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEdit = promoId !== "new";

  const [formData, setFormData] = useState<Partial<Promo>>({
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    code: "",
    isActive: true,
    startDate: "",
    endDate: "",
    packageIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit || !promoId) return;

    const fetchPromo = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/promos/${promoId}`);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Gagal memuat promo");
        }

        setFormData({
          name: data.data.name ?? "",
          description: data.data.description ?? "",
          discountType: data.data.discountType ?? "percentage",
          discountValue: data.data.discountValue ?? 0,
          code: data.data.code ?? "",
          isActive: data.data.isActive ?? true,
          startDate: data.data.startDate
            ? String(data.data.startDate).slice(0, 16)
            : "",
          endDate: data.data.endDate ? String(data.data.endDate).slice(0, 16) : "",
          packageIds:
            data.data.packages?.map(
              (item: { packageId: number }) => item.packageId,
            ) ?? [],
        });
      } catch (error) {
        console.error(error);
        setErrors({ form: "Gagal memuat promo" });
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, [isEdit, promoId]);

  const handleChange = (field: keyof Promo, value: PromoValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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

      const url = isEdit ? `/api/promos/${promoId}` : "/api/promos";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.message || "Gagal menyimpan promo" });
        }

        return;
      }

      router.push("/admin/promos");
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
          {isEdit ? "Edit Promo" : "Add New Promo"}
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
          label="Promo Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <TextInput
          label="Promo Code"
          placeholder="e.g., SAVE50"
          value={formData.code}
          onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
          error={errors.code}
          required
        />

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          rows={4}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Discount Type"
            value={formData.discountType}
            onChange={(e) => handleChange("discountType", e.target.value)}
            options={[
              {
                value: "percentage",
                label: "Percentage (%)",
              },
              {
                value: "fixed",
                label: "Fixed Amount (Rp)",
              },
            ]}
            error={errors.discountType}
          />

          <TextInput
            label="Discount Value"
            type="number"
            value={formData.discountValue}
            onChange={(e) =>
              handleChange("discountValue", Number(e.target.value))
            }
            error={errors.discountValue}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Start Date"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            error={errors.startDate}
          />

          <TextInput
            label="End Date"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            error={errors.endDate}
          />
        </div>

        <FormField label="Status">
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-gray-700">Active</span>
          </label>
        </FormField>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#173472] px-6 py-2 text-white transition-colors hover:bg-[#131C36] disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Promo"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg bg-gray-300 px-6 py-2 text-gray-900 transition-colors hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
