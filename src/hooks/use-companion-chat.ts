"use client";

import { useEffect, useRef, useState } from "react";

export type CompanionMessage = {
  id: string;
  author: "user" | "companion";
  content: string;
  createdAt: string;
};

const initialMessages: CompanionMessage[] = [
  {
    author: "companion",
    content: "Train J companion center is ready to guide the next action.",
    createdAt: "09:00",
    id: "c1",
  },
  {
    author: "user",
    content: "Show me the execution status.",
    createdAt: "09:01",
    id: "u1",
  },
];

export function useCompanionChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  });

  function sendMessage() {
    const content = draft.trim();
    if (!content) return;
    const createdAt = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((items) => [
      ...items,
      { author: "user", content, createdAt, id: crypto.randomUUID() },
      {
        author: "companion",
        content: "Recorded. I will keep the execution trail aligned.",
        createdAt,
        id: crypto.randomUUID(),
      },
    ]);
    setDraft("");
  }

  return {
    draft,
    endRef,
    guidanceHistory: [
      "Train I local certification preserved",
      "Train J routes activated",
      "Evidence package required per WP",
    ],
    messages,
    sendMessage,
    setDraft,
  };
}
