"use client";

export function UnderstandingForm() {
  return (
    <form className="rounded-lg border bg-card p-5">
      <h3 className="font-semibold">Understanding creation form</h3>
      <select
        className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm"
        defaultValue="research"
      >
        <option value="research">research</option>
        <option value="analysis">analysis</option>
        <option value="insight">insight</option>
      </select>
      <textarea
        className="mt-3 min-h-24 w-full rounded-md border bg-background p-3 text-sm"
        placeholder="Research, analysis, or insight content"
      />
    </form>
  );
}
