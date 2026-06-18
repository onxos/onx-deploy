"use client";
import PulseDashboard from "@/components/pulse/PulseDashboard";
export default function PulsePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#1e2d3d] mb-2">
        Civilization Pulse
      </h1>
      <p className="text-[#5a6c7d] mb-6">
        The heartbeat of ONX. Real-time system health, knowledge preservation,
        and SECH activity.
      </p>
      <PulseDashboard />
    </main>
  );
}
