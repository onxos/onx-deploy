import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-card-foreground">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Route not found</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        This ONX route is not registered in the current civilization shell.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
