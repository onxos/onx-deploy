import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f5] px-6 py-12">
      <section className="w-full max-w-md rounded border border-[#e6dfcf] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">
          ONX Access
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#1e2d3d]">
          Create a new password
        </h1>
        <Suspense fallback={<p className="mt-6 text-sm">Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
