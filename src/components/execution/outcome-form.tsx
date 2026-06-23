"use client";

export function OutcomeForm({
  onRecord,
}: {
  onRecord?: (value: string) => void;
}) {
  return (
    <form
      className="rounded-lg border bg-card p-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <h3 className="font-semibold">Outcome recording form</h3>
      <textarea
        className="mt-3 min-h-20 w-full rounded-md border bg-background p-3 text-sm"
        onBlur={(event) => onRecord?.(event.target.value)}
        placeholder="Record completion outcome"
      />
    </form>
  );
}
