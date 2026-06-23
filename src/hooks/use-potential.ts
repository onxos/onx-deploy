"use client";

import { useMemo, useState } from "react";
import type {
  FeasibilityRating,
  PotentialInput,
} from "@/lib/validations/potential";
import { initialDreams } from "./use-dreams";

export type Potential = PotentialInput & {
  id: string;
  parentDreamTitle: string;
};

const initialPotentials: Potential[] = [
  {
    assessmentScore: 92,
    category: "Creation",
    conversionReady: true,
    description:
      "Ship the Dream Center first, then convert its best pathways into goals.",
    dreamId: "dream-1",
    feasibility: "High",
    id: "potential-1",
    parentDreamTitle: initialDreams[0].title,
  },
  {
    assessmentScore: 68,
    category: "Learning",
    conversionReady: false,
    description: "Map the patterns that repeatedly turn intent into execution.",
    dreamId: "dream-2",
    feasibility: "Medium",
    id: "potential-2",
    parentDreamTitle: initialDreams[1].title,
  },
];

export function usePotential() {
  const [potentials, setPotentials] = useState(initialPotentials);
  const [feasibility, setFeasibility] = useState<FeasibilityRating | "All">(
    "All",
  );
  const [category, setCategory] = useState("All");

  const filteredPotentials = useMemo(
    () =>
      potentials.filter(
        (potential) =>
          (feasibility === "All" || potential.feasibility === feasibility) &&
          (category === "All" || potential.category === category),
      ),
    [category, feasibility, potentials],
  );

  function createPotential(input: PotentialInput) {
    const parentDreamTitle =
      initialDreams.find((dream) => dream.id === input.dreamId)?.title ??
      "Unlinked dream";
    setPotentials((items) => [
      { ...input, id: `potential-${items.length + 1}`, parentDreamTitle },
      ...items,
    ]);
  }

  function updatePotential(id: string, input: Partial<PotentialInput>) {
    setPotentials((items) =>
      items.map((potential) =>
        potential.id === id ? { ...potential, ...input } : potential,
      ),
    );
  }

  function markForConversion(id: string) {
    updatePotential(id, { conversionReady: true });
  }

  function usePotentialById(id: string) {
    return potentials.find((potential) => potential.id === id) ?? potentials[0];
  }

  return {
    category,
    createPotential,
    feasibility,
    filteredPotentials,
    markForConversion,
    potentials,
    setCategory,
    setFeasibility,
    updatePotential,
    usePotentialById,
  };
}
