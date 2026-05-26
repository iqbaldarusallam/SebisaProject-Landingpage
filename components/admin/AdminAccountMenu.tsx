"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  FiChevronDown,
  FiLock,
  FiLogOut,
  FiMail,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";

type AccountForm = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
};

export default function AdminAccountMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AccountForm>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      name: session?.user?.name ?? "Admin",
      email: session?.user?.email ?? "",
    }));
  }, [session?.user?.email, session?.user?.name]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message || "Gagal menyimpan akun");
        return;
      }

      setMessage("Akun tersimpan. Login ulang untuk memakai data terbaru.");
      setFormData((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
      }));
      window.setTimeout(() => {
        signOut({ redirect: true, callbackUrl: "/admin/login" });
      }, 900);
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat menyimpan akun");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
      >
        <FiUser aria-hidden />
        <span className="hidden max-w-36 truncate sm:inline">
          {session?.user?.email ?? "Admin"}
        </span>
        <FiChevronDown aria-hidden />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-[min(92vw,360px)] rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xl">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Akun Admin
              </p>
              <p className="mt-1 text-sm font-black text-slate-900">
                Ubah email & password
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <FiX aria-hidden />
            </button>
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-slate-600">
              Nama
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <FiUser aria-hidden className="text-slate-400" />
                <input
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <label className="block text-xs font-bold text-slate-600">
              Email
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <FiMail aria-hidden className="text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <label className="block text-xs font-bold text-slate-600">
              Password Saat Ini
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <FiLock aria-hidden className="text-slate-400" />
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  required
                />
              </div>
            </label>

            <label className="block text-xs font-bold text-slate-600">
              Password Baru
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <FiLock aria-hidden className="text-slate-400" />
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  placeholder="Kosongkan jika tidak diganti"
                />
              </div>
            </label>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#173472] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#131C36] disabled:opacity-50"
              >
                <FiSave aria-hidden />
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() =>
                  signOut({ redirect: true, callbackUrl: "/admin/login" })
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
              >
                <FiLogOut aria-hidden />
                Logout
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
