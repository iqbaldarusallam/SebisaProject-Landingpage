"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  TextInput,
  TextArea,
  Select,
  FormField,
} from "@/components/admin/FormField";
import { setAdminToastFlash } from "@/components/admin/AdminToast";

interface Promo {
  id: number;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  code: string;
  isActive: boolean;
  showCountdown: boolean;
  startDate: string;
  endDate: string;
  packageIds: number[];
}

type PromoValue = string | number | boolean | number[];
type PackageScope = "all" | "selected";

interface PackageOption {
  id: number;
  name: string;
}

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
    showCountdown: true,
    startDate: "",
    endDate: "",
    packageIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [packageScope, setPackageScope] = useState<PackageScope>("all");
  const formTitle = isEdit ? "Edit Kupon Promo" : "Add Kupon Promo";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        const data = await res.json();

        if (res.ok && data.ok) {
          setPackages(data.data ?? []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPackages();
  }, []);

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

        const selectedPackageIds =
          data.data.packages?.map(
            (item: { packageId: number }) => item.packageId,
          ) ?? [];

        setPackageScope(selectedPackageIds.length > 0 ? "selected" : "all");

        setFormData({
          name: data.data.name ?? "",
          description: data.data.description ?? "",
          discountType: data.data.discountType ?? "percentage",
          discountValue: data.data.discountValue ?? 0,
          code: data.data.code ?? "",
          isActive: data.data.isActive ?? true,
          showCountdown: data.data.showCountdown ?? true,
          startDate: data.data.startDate
            ? String(data.data.startDate).slice(0, 16)
            : "",
          endDate: data.data.endDate ? String(data.data.endDate).slice(0, 16) : "",
          packageIds: selectedPackageIds,
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
      if (packageScope === "selected" && !formData.packageIds?.length) {
        setErrors({ packageIds: "Pilih minimal satu paket" });
        return;
      }

      const method = isEdit ? "PUT" : "POST";

      const url = isEdit ? `/api/promos/${promoId}` : "/api/promos";
      const existingCode = formData.code?.toString().trim().toUpperCase();

      if (!existingCode || existingCode.startsWith("AUTO-")) {
        setErrors({ code: "Kode kupon wajib diisi" });
        return;
      }

      const payload = {
        ...formData,
        code: existingCode,
        packageIds: packageScope === "all" ? [] : formData.packageIds,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

      setAdminToastFlash({
        title: isEdit
          ? "Kupon promo berhasil diperbarui"
          : "Kupon promo berhasil dibuat",
        message: `Kode ${existingCode} sudah tersimpan dan siap digunakan sesuai pengaturan.`,
      });
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
          {formTitle}
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
          label="Nama Campaign"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <TextInput
          label="Kode Kupon"
          placeholder="Contoh: SAVE50"
          value={formData.code?.startsWith("AUTO-") ? "" : formData.code}
          onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
          autoCapitalize="characters"
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
            label="Jenis Potongan"
            value={formData.discountType}
            onChange={(e) => handleChange("discountType", e.target.value)}
            options={[
              {
                value: "percentage",
                label: "Persentase (%)",
              },
              {
                value: "fixed",
                label: "Nominal Tetap (Rp)",
              },
            ]}
            error={errors.discountType}
          />

          <TextInput
            label="Nilai Potongan"
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

        <FormField label="Countdown Promo">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <input
              type="checkbox"
              checked={Boolean(formData.showCountdown)}
              onChange={(e) =>
                handleChange("showCountdown", e.target.checked)
              }
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-semibold text-slate-800">
                Tampilkan countdown dan tombol claim di navbar
              </span>
              <span className="text-xs leading-relaxed text-slate-500">
                Jika dimatikan, kupon tetap bisa aktif sesuai tanggal, tetapi
                countdown promo tidak ditampilkan di halaman publik.
              </span>
            </span>
          </label>
        </FormField>

        <FormField label="Berlaku Untuk Paket" error={errors.packageIds}>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  name="packageScope"
                  checked={packageScope === "all"}
                  onChange={() => {
                    setPackageScope("all");
                    handleChange("packageIds", []);
                  }}
                />
                Semua paket
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
                <input
                  type="radio"
                  name="packageScope"
                  checked={packageScope === "selected"}
                  onChange={() => setPackageScope("selected")}
                />
                Paket tertentu
              </label>
            </div>

            {packageScope === "selected" && (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {packages.length > 0 ? (
                  packages.map((pkg) => {
                    const selectedIds = formData.packageIds ?? [];
                    const checked = selectedIds.includes(pkg.id);

                    return (
                      <label
                        key={pkg.id}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            handleChange(
                              "packageIds",
                              e.target.checked
                                ? [...selectedIds, pkg.id]
                                : selectedIds.filter((id) => id !== pkg.id),
                            );
                          }}
                        />
                        <span>{pkg.name}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">
                    Belum ada paket tersedia.
                  </p>
                )}
              </div>
            )}
          </div>
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
