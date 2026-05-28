"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiCreditCard, FiTag } from "react-icons/fi";
import { formatCurrency } from "@/lib/client-utils";
import { orderSchema } from "@/lib/validations";
import { z } from "zod";

interface CheckoutFormProps {
  packageId: number;
  packageName: string;
  basePrice: number;
  normalPrice?: number;
  initialPromoCode?: string;
  onSuccess?: (orderId: string) => void;
  onClose?: () => void;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  promoCode: string;
}

interface PricingInfo {
  basePrice: number;
  discount: number;
  total: number;
}

export default function CheckoutForm({
  packageId,
  packageName,
  basePrice,
  normalPrice: normalPriceProp,
  initialPromoCode = "",
  onSuccess,
  onClose,
}: CheckoutFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    promoCode: initialPromoCode.trim().toUpperCase(),
  });

  const [pricing, setPricing] = useState<PricingInfo>({
    basePrice,
    discount: 0,
    total: basePrice,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const normalPrice =
    normalPriceProp && normalPriceProp > basePrice ? normalPriceProp : basePrice;
  const packageDiscount = Math.max(0, normalPrice - basePrice);
  const couponDiscount = Math.max(0, pricing.discount);
  const totalSavings = packageDiscount + couponDiscount;
  const savingsPercent =
    normalPrice > 0 ? Math.round((totalSavings / normalPrice) * 100) : 0;
  const appliedPromoCode =
    couponDiscount > 0 ? formData.promoCode.trim().toUpperCase() : "";

  useEffect(() => {
    const promoCode = initialPromoCode.trim().toUpperCase();
    let ignore = false;

    const loadInitialPricing = async () => {
      if (!promoCode) {
        setPricing({
          basePrice,
          discount: 0,
          total: basePrice,
        });
        return;
      }

      try {
        const res = await fetch("/api/validate-promo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            promoCode,
            packageId,
          }),
        });

        const data = await res.json();

        if (ignore) return;

        if (data.ok) {
          setPricing(data.data);
        } else if (promoCode) {
          setErrors((prev) => ({ ...prev, promoCode: data.message }));
        }
      } catch {
        if (promoCode && !ignore) {
          setErrors((prev) => ({
            ...prev,
            promoCode: "Gagal mengecek kode promo",
          }));
        }
      }
    };

    loadInitialPricing();

    return () => {
      ignore = true;
    };
  }, [basePrice, initialPromoCode, packageId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = name === "promoCode" ? value.toUpperCase() : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));

    if (name === "promoCode") {
      setPricing({
        basePrice,
        discount: 0,
        total: basePrice,
      });
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleApplyPromo = async () => {
    const promoCode = formData.promoCode.trim().toUpperCase();
    if (!promoCode) return;

    setPromoLoading(true);
    setErrors((prev) => ({ ...prev, promoCode: "" }));
    try {
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode,
          packageId,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setPricing(data.data);
      } else {
        setErrors((prev) => ({ ...prev, promoCode: data.message }));
        setPricing({
          basePrice,
          discount: 0,
          total: basePrice,
        });
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        promoCode: "Gagal mengecek kode promo",
      }));
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = orderSchema.parse({
        ...formData,
        packageId,
      });

      setIsLoading(true);
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const data = await res.json();

      if (!data.ok) {
        setErrors({ form: data.message });
        return;
      }

      const { snapToken, orderId, transactionId } = data.data;
      const encodedOrderId = encodeURIComponent(transactionId ?? orderId);
      const successUrl = `/checkout/success?orderId=${encodedOrderId}`;
      const failedUrl = `/checkout/failed?orderId=${encodedOrderId}`;

      if (!window.snap) {
        setErrors({
          form: "Midtrans Snap belum siap. Tunggu sebentar lalu coba lagi.",
        });
        return;
      }

      window.snap.pay(snapToken, {
        onSuccess: () => {
          onSuccess?.(orderId);
          router.push(`${successUrl}&status=success`);
        },
        onPending: () => {
          onSuccess?.(orderId);
          router.push(`${successUrl}&status=pending`);
        },
        onError: () => {
          router.push(`${failedUrl}&reason=error`);
        },
        onClose: () => {
          router.push(`${failedUrl}&reason=closed`);
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ form: "An error occurred" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-[#D7E8F1] bg-[#F2FAFF] p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#206586]">
              Total Pembayaran
            </p>
            <h3 className="mt-1 font-bold text-gray-900">{packageName}</h3>
          </div>
          <div className="text-left sm:text-right">
            {packageDiscount > 0 && (
              <p className="text-sm text-gray-500 line-through">
                {formatCurrency(normalPrice)}
              </p>
            )}
            <p className="text-2xl font-extrabold text-[#173472]">
              {formatCurrency(pricing.total)}
            </p>
          </div>
        </div>

        {totalSavings > 0 && (
          <div className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-green-700">
            Hemat {savingsPercent}% dari harga normal
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Nama kamu"
              className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#173472] ${
                errors.customerName ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerName}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="nama@email.com"
              className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#173472] ${
                errors.customerEmail ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerEmail}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              placeholder="628xxxxxxxxxx"
              className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#173472] ${
                errors.customerPhone ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerPhone}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kode Kupon
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleChange}
              placeholder="KODE PROMO (OPSIONAL)"
              autoCapitalize="characters"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 uppercase tracking-wide outline-none transition focus:ring-2 focus:ring-[#173472]"
              disabled={isLoading || promoLoading}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={!formData.promoCode.trim() || promoLoading || isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E8EEF6] px-4 py-3 font-semibold text-[#173472] transition-colors hover:bg-[#DCE7F4] disabled:opacity-50"
            >
              <FiTag aria-hidden />
              {promoLoading ? "Cek..." : "Apply"}
            </button>
          </div>
          {errors.promoCode && (
            <p className="mt-2 text-sm text-red-600">{errors.promoCode}</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-600">Harga Normal:</span>
          <span>{formatCurrency(normalPrice)}</span>
        </div>

        {packageDiscount > 0 && (
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">Hemat Paket:</span>
            <span className="font-semibold text-green-700">
              -{formatCurrency(packageDiscount)}
            </span>
          </div>
        )}

        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span>{formatCurrency(pricing.basePrice)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-600">
              Kupon{appliedPromoCode ? ` ${appliedPromoCode}` : ""}:
            </span>
            <span className="font-semibold text-green-700">
              -{formatCurrency(couponDiscount)}
            </span>
          </div>
        )}

        <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold">
          <span>Total Bayar:</span>
          <span className="text-[#173472]">
            {formatCurrency(pricing.total)}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
            Hemat {savingsPercent}% ({formatCurrency(totalSavings)})
          </div>
        )}
      </div>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.form}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#173472] py-3 font-semibold text-white transition-colors hover:bg-[#131C36] disabled:opacity-50"
        >
          <FiCreditCard aria-hidden />
          {isLoading ? "Memproses..." : "Lanjut Bayar"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
