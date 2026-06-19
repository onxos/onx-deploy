"use client";

import { useMemo, useState } from "react";
import { TitanSelector } from "@/components/titan-selector";
import { api } from "@/trpc/react";

export function TitanConversationPanel() {
  const sessionId = useMemo(() => `gate6-${Date.now()}`, []);
  const [titanId, setTitanId] = useState("sech");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const converse = api.titan.converse.useMutation({
    onSuccess: (data) => setResponse(data.response),
  });

  return (
    <section className="rounded border bg-white p-4">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <TitanSelector value={titanId} onChange={setTitanId} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (message.trim()) {
              converse.mutate({ sessionId, titanId, message });
            }
          }}
        >
          <label
            className="text-sm font-semibold text-[#1e2d3d]"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            id="message"
            className="mt-2 min-h-32 w-full rounded border p-3 text-sm"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            className="mt-3 rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={converse.isPending}
            type="submit"
          >
            {converse.isPending ? "Consulting..." : "Converse"}
          </button>
        </form>
      </div>
      {response ? (
        <article className="mt-5 whitespace-pre-wrap rounded border bg-[#faf9f5] p-4 text-sm leading-6 text-[#1e2d3d]">
          {response}
        </article>
      ) : null}
    </section>
  );
}
