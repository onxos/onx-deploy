"use client";

import PulseDashboard from "@/components/pulse/PulseDashboard";

export default function PulseClient() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#1e2d3d]">
        Civilization Pulse
      </h1>
      <p className="mb-6 text-[#5a6c7d]">
        The heartbeat of ONX. Real-time system health, knowledge preservation,
        and SECH activity.
      </p>
      <PulseDashboard />
    </main>
  );
}
