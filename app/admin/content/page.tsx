"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, TextArea } from "@/components/admin/FormField";
import { useAdminToast } from "@/components/admin/AdminToast";

interface LandingContent {
  id?: number;
  navbarPromoText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroClientsText: string;
  heroBottomHeading: string;
  heroBottomText: string;
  heroBottomButtonText: string;
}

const initialState: LandingContent = {
  navbarPromoText: "PROMO 10% PER TANGGAL 25-27",
  heroTitle: "Sebisa Project",
  heroSubtitle: "We don't follow markets, we move them",
  heroCtaText: "Konsultasikan Sekarang",
  heroClientsText: "Dipercaya oleh 100+ client dari berbagai industri",
  heroBottomHeading:
    "Semua strategi dirancang khusus untuk kamu, kamu tinggal terima beres!",
  heroBottomText:
    "Konsultasikan kebutuhan kamu, dan kami akan tangani dan membantu sepenuh cinta dan kasih.",
  heroBottomButtonText: "Mulai Gratis Sekarang",
};

export default function ContentPage() {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [formData, setFormData] = useState<LandingContent>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch("/api/landing-content");
        const data = await res.json();
        if (data?.data) {
          setFormData(data.data);
        }
      } catch (error) {
        console.error("Gagal memuat landing content", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleChange = (field: keyof LandingContent, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/landing-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          showToast({
            title: "Konten gagal disimpan",
            message: data.message || "Periksa kembali data yang diisi.",
            variant: "error",
          });
        }
        return;
      }

      showToast({
        title: "Konten berhasil disimpan",
        message: "Copywriting landing page sudah diperbarui.",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      showToast({
        title: "Konten gagal disimpan",
        message: "Terjadi kesalahan saat menyimpan konten.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Landing Page Content
        </h1>
        <p className="text-gray-600">
          Atur semua copywriting halaman landing page di sini.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-xl p-6 shadow"
      >
        <TextInput
          label="Navbar Promo Text"
          value={formData.navbarPromoText}
          onChange={(e) => handleChange("navbarPromoText", e.target.value)}
          error={errors.navbarPromoText}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <TextInput
            label="Hero Title"
            value={formData.heroTitle}
            onChange={(e) => handleChange("heroTitle", e.target.value)}
            error={errors.heroTitle}
            required
          />
          <TextInput
            label="Hero CTA Text"
            value={formData.heroCtaText}
            onChange={(e) => handleChange("heroCtaText", e.target.value)}
            error={errors.heroCtaText}
            required
          />
        </div>

        <TextArea
          label="Hero Subtitle"
          value={formData.heroSubtitle}
          onChange={(e) => handleChange("heroSubtitle", e.target.value)}
          error={errors.heroSubtitle}
          rows={3}
          required
        />

        <TextArea
          label="Hero Brand Logos Text"
          value={formData.heroClientsText}
          onChange={(e) => handleChange("heroClientsText", e.target.value)}
          error={errors.heroClientsText}
          rows={2}
          required
        />

        <TextArea
          label="Hero Bottom Heading"
          value={formData.heroBottomHeading}
          onChange={(e) => handleChange("heroBottomHeading", e.target.value)}
          error={errors.heroBottomHeading}
          rows={3}
          required
        />

        <TextArea
          label="Hero Bottom Text"
          value={formData.heroBottomText}
          onChange={(e) => handleChange("heroBottomText", e.target.value)}
          error={errors.heroBottomText}
          rows={3}
          required
        />

        <TextInput
          label="Hero Bottom Button Text"
          value={formData.heroBottomButtonText}
          onChange={(e) => handleChange("heroBottomButtonText", e.target.value)}
          error={errors.heroBottomButtonText}
          required
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#173472] px-6 py-2 text-white hover:bg-[#131C36] transition-colors disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan Konten"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="rounded-lg bg-gray-200 px-6 py-2 text-gray-900 hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
