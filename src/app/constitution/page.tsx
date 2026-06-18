"use client";
import PrinciplesList from "@/components/constitution/PrinciplesList";
export default function ConstitutionPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#1e2d3d] mb-2">
        Constitutional Rules of ONX
      </h1>
      <p className="text-[#5a6c7d] mb-6">
        The 7 principles that govern every ONX system, decision, and
        interaction.
      </p>
      <PrinciplesList />
    </main>
  );
}
