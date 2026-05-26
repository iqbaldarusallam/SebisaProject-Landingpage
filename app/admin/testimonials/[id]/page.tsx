"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TextInput, TextArea } from "@/components/admin/FormField";

interface Testimonial {
  id: number;
  name: string;
  brand: string;
  content: string;
  rating: number;
}

export default function TestimonialFormPage() {
  const router = useRouter();
  const params = useParams();
  const testimonialId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEdit = testimonialId !== "new";

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: "",
    brand: "",
    content: "",
    rating: 5,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTestimonial = async () => {
      if (!testimonialId) return;

      try {
        const res = await fetch(`/api/testimonials/${testimonialId}`);
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Gagal memuat testimonial");
        }
        setFormData({
          name: data.data.name ?? "",
          brand: data.data.brand ?? "",
          content: data.data.content ?? "",
          rating: data.data.rating ?? 5,
        });
      } catch (error) {
        console.error("Gagal memuat testimonial", error);
        setErrors((prev) => ({
          ...prev,
          form: "Gagal memuat testimonial",
        }));
      } finally {
        setLoading(false);
      }
    };

    if (isEdit) {
      loadTestimonial();
    }
  }, [isEdit, testimonialId]);

  const handleChange = (field: keyof Testimonial, value: string | number) => {
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
      const url = isEdit
        ? `/api/testimonials/${testimonialId}`
        : "/api/testimonials";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.message || "Gagal menyimpan testimonial" });
        }
        return;
      }

      router.push("/admin/testimonials");
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
          {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
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

        {isEdit && (
          <TextInput
            label="Testimoni ID"
            value={testimonialId ?? ""}
            disabled
          />
        )}

        <TextInput
          label="Nama"
          value={formData.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <TextInput
          label="Brand / Jabatan"
          value={formData.brand ?? ""}
          onChange={(e) => handleChange("brand", e.target.value)}
          error={errors.brand}
          placeholder="Founder Kopi Ruang Kota"
          required
        />

        <TextInput
          label="Rating (1-5)"
          type="number"
          min="1"
          max="5"
          value={formData.rating ?? 5}
          onChange={(e) => handleChange("rating", Number(e.target.value))}
          error={errors.rating}
          required
        />

        <TextArea
          label="Content"
          value={formData.content ?? ""}
          onChange={(e) => handleChange("content", e.target.value)}
          error={errors.content}
          maxLength={100}
          rows={5}
          required
        />
        <p className="-mt-4 text-xs text-slate-500">
          {(formData.content ?? "").length}/100 karakter
        </p>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#173472] text-white px-6 py-2 rounded-lg hover:bg-[#131C36] transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Testimonial"}
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
