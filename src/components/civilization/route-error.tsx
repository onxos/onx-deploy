"use client";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded border border-red-200 bg-red-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">
          ONX Runtime Notice
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#1e2d3d]">
          This civilizational view could not load.
        </h1>
        <p className="mt-3 text-sm text-[#5a6c7d]">
          The system preserved the route and caught the error gracefully. Report
          this code to the engineering track if it repeats.
        </p>
        <p className="mt-3 rounded bg-white px-3 py-2 text-xs text-[#5a6c7d]">
          Error code: {error.digest ?? error.message}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
