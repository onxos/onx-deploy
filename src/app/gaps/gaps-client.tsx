"use client";

import GapCards from "@/components/gaps/GapCards";

export default function GapsClient() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#1e2d3d]">
        Gap Closure Status
      </h1>
      <p className="mb-6 text-[#5a6c7d]">
        13 gaps approved by the Founder. 7 closed. 6 on roadmap. All tracked.
      </p>
      <GapCards />
    </main>
  );
}
