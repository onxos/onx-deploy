"use client";
import GapCards from "@/components/gaps/GapCards";
export default function GapsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-[#1e2d3d] mb-2">
        Gap Closure Status
      </h1>
      <p className="text-[#5a6c7d] mb-6">
        13 gaps approved by the Founder. 7 closed. 6 on roadmap. All tracked.
      </p>
      <GapCards />
    </main>
  );
}
