"use client";

export function ToastAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-md border px-3 py-1 text-sm"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
