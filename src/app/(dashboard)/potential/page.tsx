"use client";

import { PotentialFilters } from "@/components/potential/potential-filters";
import { PotentialForm } from "@/components/potential/potential-form";
import { PotentialList } from "@/components/potential/potential-list";
import { usePotential } from "@/hooks/use-potential";

export default function PotentialPage() {
  const potential = usePotential();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-semibold">Potential Discovery</h1>
        <p className="text-muted-foreground">
          Analyze dreams into scored, feasible pathways for goal conversion.
        </p>
      </div>
      <PotentialFilters
        category={potential.category}
        feasibility={potential.feasibility}
        setCategory={potential.setCategory}
        setFeasibility={potential.setFeasibility}
      />
      <PotentialForm onSubmit={potential.createPotential} />
      <PotentialList potentials={potential.filteredPotentials} />
    </main>
  );
}
