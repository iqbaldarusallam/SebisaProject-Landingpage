"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/client-utils";
import { orderSchema } from "@/lib/validations";
import { z } from "zod";

interface CheckoutFormProps {
  packageId: number;
  packageName: string;
  basePrice: number;
  strikePrice?: number;
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
  strikePrice,
  initialPromoCode = "",
  onSuccess,
  onClose,
}: CheckoutFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    promoCode: initialPromoCode,
  });

  const [pricing, setPricing] = useState<PricingInfo>({
    basePrice,
    discount: 0,
    total: basePrice,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) return;

    setPromoLoading(true);
    try {
      const res = await fetch("/api/checkout/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: formData.promoCode,
          packageId,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setPricing(data.data);
      } else {
        setErrors((prev) => ({ ...prev, promoCode: data.message }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, promoCode: "Failed to validate promo" }));
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
      const res = await fetch("/api/checkout/create-order", {
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
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">{packageName}</h3>
        {strikePrice && (
          <p className="text-gray-600 line-through">
            {formatCurrency(strikePrice)}
          </p>
        )}
        <p className="text-xl font-bold text-[#173472]">
          {formatCurrency(pricing.total)}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Your name"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173472] outline-none ${
              errors.customerName ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.customerName && (
            <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173472] outline-none ${
              errors.customerEmail ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.customerEmail && (
            <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            placeholder="628xxxxxxxxxx"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#173472] outline-none ${
              errors.customerPhone ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {errors.customerPhone && (
            <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            name="promoCode"
            value={formData.promoCode}
            onChange={handleChange}
            placeholder="Promo code (optional)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173472] outline-none"
            disabled={isLoading || promoLoading}
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            disabled={!formData.promoCode.trim() || promoLoading || isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            {promoLoading ? "Checking..." : "Apply"}
          </button>
        </div>
        {errors.promoCode && (
          <p className="text-red-600 text-sm">{errors.promoCode}</p>
        )}
      </div>

      {pricing.discount > 0 && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>{formatCurrency(pricing.basePrice)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Discount:</span>
            <span className="text-green-600">
              -{formatCurrency(pricing.discount)}
            </span>
          </div>
          <div className="border-t border-green-200 pt-2 flex justify-between font-bold">
            <span>Total:</span>
            <span className="text-green-600">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>
      )}

      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.form}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#173472] text-white py-3 rounded-lg font-semibold hover:bg-[#131C36] disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Processing..." : "Pay Now"}
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
