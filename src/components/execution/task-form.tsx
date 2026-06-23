"use client";

export function TaskForm() {
  return (
    <form className="rounded-lg border bg-card p-5">
      <h3 className="font-semibold">Task creation form linked to goals</h3>
      <input
        className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm"
        placeholder="Task title"
      />
      <textarea
        className="mt-3 min-h-20 w-full rounded-md border bg-background p-3 text-sm"
        placeholder="Task description"
      />
    </form>
  );
}
