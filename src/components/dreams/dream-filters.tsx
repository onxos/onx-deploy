"use client";

import {
  type DreamCategory,
  type DreamPriority,
  dreamCategories,
  dreamPriorities,
} from "@/lib/validations/dream";

export function DreamFilters({
  category,
  priority,
  search,
  setCategory,
  setPriority,
  setSearch,
}: {
  category: DreamCategory | "All";
  priority: DreamPriority | "All";
  search: string;
  setCategory: (value: DreamCategory | "All") => void;
  setPriority: (value: DreamPriority | "All") => void;
  setSearch: (value: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <input
        aria-label="Search dreams"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search dreams by title or description"
        value={search}
      />
      <div className="flex flex-wrap gap-2">
        {(["All", ...dreamCategories] as const).map((item) => (
          <button
            className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={category === item}
            key={item}
            onClick={() => setCategory(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(["All", ...dreamPriorities] as const).map((item) => (
          <button
            className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={priority === item}
            key={item}
            onClick={() => setPriority(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
