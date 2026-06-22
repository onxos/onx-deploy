"use client";

export function MessageInput({
  draft,
  onChange,
  onSend,
}: {
  draft: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        aria-label="Message input"
        className="h-11 flex-1 rounded-md border bg-background px-3 text-sm"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSend();
        }}
        placeholder="Ask the companion..."
        value={draft}
      />
      <button
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        onClick={onSend}
        type="button"
      >
        Send
      </button>
    </div>
  );
}
