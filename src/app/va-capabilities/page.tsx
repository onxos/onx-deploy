"use client";
import CapabilityList from "@/components/va-capabilities/CapabilityList";
export default function VACapabilitiesPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#1e2d3d] mb-2">
        ONX-VA Capabilities
      </h1>
      <p className="text-[#5a6c7d] mb-6">
        25 AI capabilities. 19 operational. 6 deferred. All documented.
      </p>
      <CapabilityList />
    </main>
  );
}
