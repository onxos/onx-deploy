"use client";

import { useMemo, useState } from "react";
import type { UnderstandingType } from "@/lib/validations/workspace";

export type UnderstandingCardData = {
  id: string;
  type: UnderstandingType;
  content: string;
  linkedEntity: {
    entityId: string;
    entityType: "dream" | "goal";
    label: string;
  };
  notes: string;
};

const initialUnderstanding: UnderstandingCardData[] = [
  {
    content: "Dreams become executable when the first next action is visible.",
    id: "understanding-1",
    linkedEntity: {
      entityId: "dream-1",
      entityType: "dream",
      label: "Build the ONX core experience",
    },
    notes: "Evidence discipline is part of the operating layer.",
    type: "insight",
  },
  {
    content: "Route-level proof and UI-level proof need to stay paired.",
    id: "understanding-2",
    linkedEntity: {
      entityId: "goal-1",
      entityType: "goal",
      label: "Close Train K",
    },
    notes: "Use this in closure reports.",
    type: "analysis",
  },
];

export function useUnderstanding() {
  const [items, setItems] = useState(initialUnderstanding);
  const [type, setType] = useState<UnderstandingType | "All">("All");
  const filteredUnderstanding = useMemo(
    () => items.filter((item) => type === "All" || item.type === type),
    [items, type],
  );

  function createUnderstanding(input: Omit<UnderstandingCardData, "id">) {
    setItems((current) => [
      { ...input, id: `understanding-${current.length + 1}` },
      ...current,
    ]);
  }

  return { createUnderstanding, filteredUnderstanding, items, setType, type };
}
