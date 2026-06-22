"use client";

export function Tag({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm">
      {children}
      {onRemove ? (
        <button aria-label="Remove tag" onClick={onRemove} type="button">
          x
        </button>
      ) : null}
    </span>
  );
}
