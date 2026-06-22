"use client";

import { useMemo, useState } from "react";

export type AutocompleteOption = { label: string; value: string };

export function Autocomplete({
  options,
  onSelect,
  placeholder = "Choose...",
}: {
  options: AutocompleteOption[];
  onSelect: (option: AutocompleteOption) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const filtered = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [options, query],
  );
  const active = filtered[activeIndex];

  return (
    <div className="relative">
      <input
        aria-autocomplete="list"
        aria-expanded={Boolean(query)}
        aria-label="Autocomplete"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown")
            setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
          if (event.key === "ArrowUp")
            setActiveIndex((index) => Math.max(index - 1, 0));
          if (event.key === "Enter" && active) onSelect(active);
        }}
        placeholder={placeholder}
        role="combobox"
        value={query}
      />
      {query ? (
        <div
          className="absolute z-20 mt-1 w-full rounded-md border bg-popover p-1 shadow"
          role="listbox"
        >
          {filtered.map((option, index) => (
            <button
              aria-selected={index === activeIndex}
              className="block w-full rounded px-2 py-1.5 text-left text-sm aria-selected:bg-muted"
              key={option.value}
              onMouseDown={() => onSelect(option)}
              role="option"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
