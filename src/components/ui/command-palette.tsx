"use client";

import { useEffect, useState } from "react";

export function CommandPalette({
  commands,
}: {
  commands: Array<{ label: string; action: () => void }>;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  return (
    <button
      aria-label="Close command palette"
      className="fixed inset-0 z-50 grid place-items-start bg-background/80 p-4 pt-24 backdrop-blur-sm"
      onMouseDown={() => setOpen(false)}
      type="button"
    >
      <div
        className="mx-auto w-full max-w-xl rounded-lg border bg-card p-2 shadow-lg"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        {commands.map((command) => (
          <button
            className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
            key={command.label}
            onClick={() => {
              command.action();
              setOpen(false);
            }}
            type="button"
          >
            {command.label}
          </button>
        ))}
      </div>
    </button>
  );
}
