"use client";

import { useMemo, useState } from "react";
import type { ConfidenceLevel } from "@/lib/validations/workspace";

export type JudgmentCardData = {
  id: string;
  verdict: string;
  confidence: ConfidenceLevel;
  rationale: string;
  linkedEntity: {
    entityId: string;
    entityType: "dream" | "goal";
    label: string;
  };
  evidence: string;
};

const initialJudgments: JudgmentCardData[] = [
  {
    confidence: "High",
    evidence: "Train K package has 50 binary criteria and route map.",
    id: "judgment-1",
    linkedEntity: {
      entityId: "goal-1",
      entityType: "goal",
      label: "Close Train K",
    },
    rationale: "Scope is concrete enough to execute without clarification.",
    verdict: "Proceed sequentially through WP-K-01 to WP-K-05",
  },
];

export function useJudgment() {
  const [items, setItems] = useState(initialJudgments);
  const [confidence, setConfidence] = useState<ConfidenceLevel | "All">("All");
  const filteredJudgments = useMemo(
    () =>
      items.filter(
        (item) => confidence === "All" || item.confidence === confidence,
      ),
    [confidence, items],
  );

  function createJudgment(input: Omit<JudgmentCardData, "id">) {
    setItems((current) => [
      { ...input, id: `judgment-${current.length + 1}` },
      ...current,
    ]);
  }

  return {
    confidence,
    createJudgment,
    filteredJudgments,
    items,
    setConfidence,
  };
}
