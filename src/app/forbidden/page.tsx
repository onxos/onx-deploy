import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f5] px-6 py-12">
      <section className="w-full max-w-lg rounded border border-[#e6dfcf] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">
          ONX Access
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#1e2d3d]">
          Access forbidden
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5a6c7d]">
          Your current role does not have permission to view this route.
        </p>
        <Link
          className="mt-6 inline-flex rounded border border-[#1e2d3d] px-4 py-2 text-sm font-semibold text-[#1e2d3d]"
          href="/pulse"
        >
          Return to pulse
        </Link>
      </section>
    </main>
  );
}
