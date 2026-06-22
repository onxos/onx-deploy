"use client";

export type FilterChip = { label: string; value: string };

export function FilterChips({
  filters,
  onRemove,
  onAdd,
}: {
  filters: FilterChip[];
  onRemove: (value: string) => void;
  onAdd?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          className="rounded-full border px-3 py-1 text-sm"
          key={filter.value}
          onClick={() => onRemove(filter.value)}
          type="button"
        >
          {filter.label} x
        </button>
      ))}
      {onAdd ? (
        <button
          className="rounded-full border border-dashed px-3 py-1 text-sm"
          onClick={onAdd}
          type="button"
        >
          Add filter
        </button>
      ) : null}
    </div>
  );
}
