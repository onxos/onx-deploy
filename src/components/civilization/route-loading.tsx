export default function RouteLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">
        Loading ONX Knowledge...
      </p>
      <div className="mt-4 h-8 w-72 animate-pulse rounded bg-[#e6dfcf]" />
      <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-[#efe9dc]" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded border bg-white p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-[#e6dfcf]" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#efe9dc]" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-[#efe9dc]" />
          </div>
        ))}
      </div>
    </main>
  );
}
