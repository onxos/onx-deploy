"use client";

import { useId, useState } from "react";
import { SourceCitations } from "@/components/source-citations";
import { api } from "@/trpc/react";

export function ChatInterface() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<{
    response: string;
    sourceRefs: string[];
    confidence: string | null;
  } | null>(null);
  const ask = api.civilization.ask.useMutation({
    onSuccess: (data) => setAnswer(data),
  });

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded border bg-white p-4">
        <label htmlFor={id} className="text-sm font-semibold text-[#1e2d3d]">
          Ask ONX
        </label>
        <textarea
          id={id}
          className="mt-2 min-h-36 w-full rounded border p-3 text-sm"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask about the ONX corpus, gates, titans, or governance."
        />
        <button
          className="mt-3 rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={ask.isPending}
          type="button"
          onClick={() => {
            if (query.trim()) ask.mutate({ query });
          }}
        >
          {ask.isPending ? "Asking..." : "Ask"}
        </button>

        {answer ? (
          <article className="mt-5 whitespace-pre-wrap rounded border bg-[#faf9f5] p-4 text-sm leading-6 text-[#1e2d3d]">
            {answer.response}
          </article>
        ) : null}
      </div>

      <aside className="rounded border bg-white p-4">
        <h2 className="font-semibold text-[#1e2d3d]">Citations</h2>
        <p className="mt-1 text-sm text-[#5a6c7d]">
          Confidence: {answer?.confidence ?? "pending"}
        </p>
        <div className="mt-4">
          <SourceCitations sources={answer?.sourceRefs ?? []} />
        </div>
      </aside>
    </section>
  );
}
