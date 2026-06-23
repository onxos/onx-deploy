"use client";

export function JudgmentForm() {
  return (
    <form className="rounded-lg border bg-card p-5">
      <h3 className="font-semibold">Judgment creation form</h3>
      <input
        className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm"
        placeholder="Verdict"
      />
      <select
        className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm"
        defaultValue="High"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Certain</option>
      </select>
      <textarea
        className="mt-3 min-h-24 w-full rounded-md border bg-background p-3 text-sm"
        placeholder="Rationale and evidence"
      />
    </form>
  );
}
