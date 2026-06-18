"use client";
import { sechMetrics } from "@/lib/pulse/pulse-data";
export default function SechActivity() {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold text-[#1e2d3d] mb-3">SECH Activity</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#5a6c7d]">Ethics checks</span>
          <span className="font-semibold text-[#1e2d3d]">
            {sechMetrics.ethicsChecksPassed.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#5a6c7d]">Memory preserved</span>
          <span className="font-semibold text-[#1e2d3d]">
            {sechMetrics.memoryPreservedPercent}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#5a6c7d]">Harmony</span>
          <span className="font-semibold text-green-600">
            {sechMetrics.harmonyStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
