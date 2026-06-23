"use client";

import { PotentialDetail } from "@/components/potential/potential-detail";
import { usePotential } from "@/hooks/use-potential";

export default function PotentialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const potentialState = usePotential();
  const potential = potentialState.usePotentialById("potential-1");

  void params;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <PotentialDetail
        onMarkForConversion={() =>
          potentialState.markForConversion(potential.id)
        }
        potential={potential}
      />
    </main>
  );
}
