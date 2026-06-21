import ForgotPasswordForm from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f5] px-6 py-12">
      <section className="w-full max-w-md rounded border border-[#e6dfcf] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">
          ONX Access
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#1e2d3d]">
          Reset password
        </h1>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
