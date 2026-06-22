"use client";

import type { RefObject } from "react";
import type { CompanionMessage } from "@/hooks/use-companion-chat";
import { cn } from "@/lib/utils";

export function MessageList({
  endRef,
  messages,
}: {
  endRef: RefObject<HTMLDivElement | null>;
  messages: CompanionMessage[];
}) {
  return (
    <div
      aria-label="Message history"
      className="max-h-[28rem] space-y-3 overflow-y-auto rounded-lg border bg-card p-4"
      role="log"
    >
      {messages.map((message) => (
        <div
          className={cn(
            "max-w-[85%] rounded-lg px-4 py-3 text-sm",
            message.author === "user"
              ? "ml-auto bg-primary text-primary-foreground"
              : "bg-muted",
          )}
          key={message.id}
        >
          <p>{message.content}</p>
          <p className="mt-1 text-xs opacity-70">{message.createdAt}</p>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
