"use client";

import { useEffect, useState } from "react";

export function SearchInput({
  value = "",
  onChange,
  delay = 300,
  placeholder = "Search...",
}: {
  value?: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => setLocalValue(value), [value]);
  useEffect(() => {
    const timer = window.setTimeout(() => onChange(localValue), delay);
    return () => window.clearTimeout(timer);
  }, [delay, localValue, onChange]);

  return (
    <div className="flex w-full items-center gap-2 rounded-md border bg-background px-3">
      <input
        aria-label="Search"
        className="h-10 flex-1 bg-transparent text-sm outline-none"
        onChange={(event) => setLocalValue(event.target.value)}
        placeholder={placeholder}
        value={localValue}
      />
      {localValue ? (
        <button
          aria-label="Clear search"
          onClick={() => setLocalValue("")}
          type="button"
        >
          x
        </button>
      ) : null}
    </div>
  );
}
