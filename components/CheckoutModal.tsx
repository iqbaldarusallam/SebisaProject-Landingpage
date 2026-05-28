'use client';

import { useEffect } from 'react';
import CheckoutForm from './CheckoutForm';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number;
  packageName: string;
  basePrice: number;
  normalPrice?: number;
  initialPromoCode?: string;
  onSuccess?: (orderId: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  packageId,
  packageName,
  basePrice,
  normalPrice,
  initialPromoCode,
  onSuccess,
}: CheckoutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <CheckoutForm
            packageId={packageId}
            packageName={packageName}
            basePrice={basePrice}
            normalPrice={normalPrice}
            initialPromoCode={initialPromoCode}
            onClose={onClose}
            onSuccess={(orderId) => {
              onSuccess?.(orderId);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
