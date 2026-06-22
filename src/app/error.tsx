"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-destructive">
      <h1 className="text-xl font-semibold">Something went off path</h1>
      <p className="mt-2 text-sm">
        The ONX shell stayed online, but this route failed to render.
      </p>
      <pre className="mt-4 overflow-auto rounded-md bg-background p-3 text-xs text-foreground">
        {error.message}
      </pre>
      <button
        type="button"
        className="mt-4 min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
