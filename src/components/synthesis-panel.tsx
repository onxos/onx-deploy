"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

export function SynthesisPanel() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<"topic" | "comparative" | "gap-analysis">(
    "topic",
  );
  const [summary, setSummary] = useState<string | null>(null);
  const synthesize = api.civilization.synthesize.useMutation({
    onSuccess: (data) => setSummary(data.summary),
  });

  return (
    <section className="rounded border bg-white p-4">
      <h2 className="font-semibold text-[#1e2d3d]">Knowledge Synthesis</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto]">
        <input
          className="rounded border p-2 text-sm"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Topic"
        />
        <select
          className="rounded border p-2 text-sm"
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as "topic" | "comparative" | "gap-analysis",
            )
          }
        >
          <option value="topic">Topic</option>
          <option value="comparative">Comparative</option>
          <option value="gap-analysis">Gap analysis</option>
        </select>
        <button
          className="rounded bg-[#1e2d3d] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={synthesize.isPending}
          onClick={() => topic.trim() && synthesize.mutate({ topic, type })}
          type="button"
        >
          Synthesize
        </button>
      </div>
      {summary ? (
        <pre className="mt-4 whitespace-pre-wrap rounded border bg-[#faf9f5] p-4 text-sm text-[#1e2d3d]">
          {summary}
        </pre>
      ) : null}
    </section>
  );
}
