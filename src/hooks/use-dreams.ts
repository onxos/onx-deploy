"use client";

import { useMemo, useState } from "react";
import type {
  DreamCategory,
  DreamInput,
  DreamPriority,
  DreamStatus,
} from "@/lib/validations/dream";

export type Dream = DreamInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const initialDreams: Dream[] = [
  {
    category: "Professional",
    createdAt: "2026-06-22",
    description:
      "Create the ONX Dream-to-Goal operating layer for veterinary civilization work.",
    id: "dream-1",
    priority: "Critical",
    status: "Active",
    title: "Build the ONX core experience",
    updatedAt: "2026-06-22",
  },
  {
    category: "Creative",
    createdAt: "2026-06-21",
    description:
      "Turn captured founder intent into a reusable product workflow.",
    id: "dream-2",
    priority: "High",
    status: "Draft",
    title: "Capture dreams as operational material",
    updatedAt: "2026-06-22",
  },
];

export function useDreams() {
  const [dreams, setDreams] = useState(initialDreams);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<DreamCategory | "All">("All");
  const [priority, setPriority] = useState<DreamPriority | "All">("All");

  const filteredDreams = useMemo(
    () =>
      dreams.filter((dream) => {
        const matchesSearch = `${dream.title} ${dream.description}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          category === "All" || dream.category === category;
        const matchesPriority =
          priority === "All" || dream.priority === priority;
        return matchesSearch && matchesCategory && matchesPriority;
      }),
    [category, dreams, priority, search],
  );

  function createDream(input: DreamInput) {
    const now = new Date().toISOString().slice(0, 10);
    setDreams((items) => [
      {
        ...input,
        createdAt: now,
        id: `dream-${items.length + 1}`,
        updatedAt: now,
      },
      ...items,
    ]);
  }

  function updateDream(id: string, input: Partial<DreamInput>) {
    setDreams((items) =>
      items.map((dream) =>
        dream.id === id
          ? {
              ...dream,
              ...input,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : dream,
      ),
    );
  }

  function archiveDream(id: string) {
    updateDream(id, { status: "Archived" });
  }

  function useDream(id: string) {
    return dreams.find((dream) => dream.id === id) ?? dreams[0];
  }

  return {
    archiveDream,
    category,
    createDream,
    dreams,
    filteredDreams,
    priority,
    search,
    setCategory,
    setPriority,
    setSearch,
    updateDream,
    useDream,
  };
}

export type { DreamStatus };
