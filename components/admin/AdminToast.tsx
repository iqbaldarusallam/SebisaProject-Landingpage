"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

type AdminToastVariant = "success" | "error" | "info";

type AdminToastInput = {
  title: string;
  message?: string;
  variant?: AdminToastVariant;
};

type AdminToast = AdminToastInput & {
  id: number;
  variant: AdminToastVariant;
};

type AdminToastContextValue = {
  showToast: (toast: AdminToastInput) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);
const ADMIN_TOAST_FLASH_KEY = "sebisa-admin-toast";
const ADMIN_TOAST_EVENT = "sebisa-admin-toast-event";

const toastStyles = {
  success: {
    icon: FiCheckCircle,
    iconClass: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    barClass: "bg-emerald-500",
  },
  error: {
    icon: FiAlertCircle,
    iconClass: "bg-red-50 text-red-600 ring-red-100",
    barClass: "bg-red-500",
  },
  info: {
    icon: FiInfo,
    iconClass: "bg-sky-50 text-sky-600 ring-sky-100",
    barClass: "bg-sky-500",
  },
};

export function setAdminToastFlash(toast: AdminToastInput) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage?.setItem(ADMIN_TOAST_FLASH_KEY, JSON.stringify(toast));
  } catch {
    // Some embedded browser contexts can disable session storage.
  }

  try {
    window.dispatchEvent(new CustomEvent(ADMIN_TOAST_EVENT, { detail: toast }));
  } catch {
    const event = document.createEvent("CustomEvent");
    event.initCustomEvent(ADMIN_TOAST_EVENT, false, false, toast);
    window.dispatchEvent(event);
  }
}

export function AdminToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: AdminToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const nextToast: AdminToast = {
      ...toast,
      id,
      variant: toast.variant ?? "success",
    };

    setToasts((current) => [...current.slice(-2), nextToast]);
    window.setTimeout(() => removeToast(id), 4200);
  }, [removeToast]);

  useEffect(() => {
    let rawToast: string | null = null;

    try {
      rawToast = window.sessionStorage?.getItem(ADMIN_TOAST_FLASH_KEY) ?? null;
      window.sessionStorage?.removeItem(ADMIN_TOAST_FLASH_KEY);
    } catch {
      rawToast = null;
    }

    if (!rawToast) return;

    try {
      showToast(JSON.parse(rawToast) as AdminToastInput);
    } catch {
      showToast({
        title: "Berhasil",
        message: "Perubahan data admin sudah disimpan.",
      });
    }
  }, [pathname, showToast]);

  useEffect(() => {
    const handleToastEvent = (event: Event) => {
      try {
        window.sessionStorage?.removeItem(ADMIN_TOAST_FLASH_KEY);
      } catch {
        // Ignore unavailable browser storage.
      }

      showToast((event as CustomEvent<AdminToastInput>).detail);
    };

    window.addEventListener(ADMIN_TOAST_EVENT, handleToastEvent);
    return () => window.removeEventListener(ADMIN_TOAST_EVENT, handleToastEvent);
  }, [showToast]);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <AdminToastContext.Provider value={contextValue}>
      {children}

      <div className="pointer-events-none fixed right-4 top-16 z-[90] flex w-[min(calc(100vw-2rem),390px)] flex-col gap-3 sm:right-6">
        {toasts.map((toast) => {
          const style = toastStyles[toast.variant];
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/12"
            >
              <div className="flex">
                <div className={`w-1.5 shrink-0 ${style.barClass}`} />
                <div className="flex min-w-0 flex-1 items-start gap-3 p-4">
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-full ring-1 ${style.iconClass}`}
                  >
                    <Icon aria-hidden className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-slate-950">
                      {toast.title}
                    </p>
                    {toast.message && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {toast.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="Tutup notifikasi"
                    onClick={() => removeToast(toast.id)}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <FiX aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);

  if (!context) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }

  return context;
}
