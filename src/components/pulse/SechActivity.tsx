"use client";

import type { inferRouterOutputs } from "@trpc/server";
import { sechMetrics } from "@/lib/pulse/pulse-data";
import type { AppRouter } from "@/server/api/root";

type SechStatus = inferRouterOutputs<AppRouter>["sech"]["getCurrentStatus"];

interface Props {
  sechStatus?: SechStatus;
}

export default function SechActivity({ sechStatus }: Props) {
  const allClear = sechStatus?.every((s) => s.status === "clear") ?? true;

  return (
    <div className="bg-white border rounded-lg p-4">
      <h2 className="font-semibold text-[#1e2d3d] mb-3">SECH Activity</h2>
      {sechStatus ? (
        <div className="space-y-2 text-sm">
          {sechStatus.map((s) => (
            <div key={s.layer} className="flex justify-between">
              <span className="text-[#5a6c7d]">Layer {s.layer}</span>
              <span
                className={`font-semibold capitalize ${s.status === "clear" ? "text-green-800" : s.status === "veto" ? "text-red-700" : "text-yellow-800"}`}
              >
                {s.status}
              </span>
            </div>
          ))}
          <div className="flex justify-between pt-1 border-t">
            <span className="text-[#5a6c7d]">Overall</span>
            <span
              className={`font-semibold ${allClear ? "text-green-800" : "text-yellow-800"}`}
            >
              {allClear ? "All Clear" : "Advisory"}
            </span>
          </div>
        </div>
      ) : (
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
            <span className="font-semibold text-green-800">
              {sechMetrics.harmonyStatus}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
