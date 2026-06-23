"use client";

import { DreamFilters } from "@/components/dreams/dream-filters";
import { DreamForm } from "@/components/dreams/dream-form";
import { DreamList } from "@/components/dreams/dream-list";
import { useDreams } from "@/hooks/use-dreams";

export default function DreamsPage() {
  const dreams = useDreams();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Dream Center</h1>
        <p className="text-muted-foreground">
          Capture dreams, categorize them, and begin the Dream-to-Goal
          lifecycle.
        </p>
      </div>
      <DreamFilters
        category={dreams.category}
        priority={dreams.priority}
        search={dreams.search}
        setCategory={dreams.setCategory}
        setPriority={dreams.setPriority}
        setSearch={dreams.setSearch}
      />
      <DreamForm onSubmit={dreams.createDream} />
      <DreamList dreams={dreams.filteredDreams} />
    </main>
  );
}
