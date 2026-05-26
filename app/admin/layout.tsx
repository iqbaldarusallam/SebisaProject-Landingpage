"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiBox,
  FiBriefcase,
  FiFileText,
  FiGift,
  FiHome,
  FiImage,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import AdminAccountMenu from "@/components/admin/AdminAccountMenu";

const navigation: Array<{ name: string; href: string; icon: IconType }> = [
  { name: "Dashboard", href: "/admin/dashboard", icon: FiHome },
  { name: "Admins", href: "/admin/admins", icon: FiUsers },
  { name: "Packages", href: "/admin/packages", icon: FiBox },
  { name: "Promos", href: "/admin/promos", icon: FiGift },
  { name: "Testimonials", href: "/admin/testimonials", icon: FiMessageSquare },
  { name: "Brand Logos", href: "/admin/trusted-brands", icon: FiImage },
  { name: "Customers", href: "/admin/customers", icon: FiBriefcase },
  { name: "Content", href: "/admin/content", icon: FiFileText },
  { name: "Orders", href: "/admin/orders", icon: FiShoppingCart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSuperAdmin = session?.user?.role === "super_admin";
  const visibleNavigation = navigation.filter(
    (item) => item.href !== "/admin/admins" || isSuperAdmin,
  );

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Sebisa
            </p>
            <h2 className="mt-1 text-xl font-black text-[#173472]">
              Admin Panel
            </h2>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {visibleNavigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#173472] text-white shadow-lg shadow-blue-950/10"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#173472]"
                  }`}
                >
                  <span
                    className={`grid size-7 place-items-center rounded-md text-[11px] font-black ${
                      isActive ? "bg-white/15" : "bg-slate-200"
                    }`}
                  >
                    <Icon aria-hidden className="size-4" />
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">Logged in as</p>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {session?.user?.email ?? "Admin"}
            </p>
            <button
              onClick={() =>
                signOut({ redirect: true, callbackUrl: "/admin/login" })
              }
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <FiLogOut aria-hidden />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-12 items-center justify-between px-4 sm:px-5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 lg:hidden"
            >
              <FiMenu aria-hidden />
              Menu
            </button>
            <div className="hidden text-xs font-semibold text-slate-500 lg:block">
              Admin workspace
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden text-xs font-semibold text-slate-600 sm:block">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date())}
              </div>
              <AdminAccountMenu />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
