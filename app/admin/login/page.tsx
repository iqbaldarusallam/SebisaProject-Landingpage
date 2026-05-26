import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Suspense
        fallback={
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-600 shadow-xl shadow-slate-950/5">
            Memuat form login...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
