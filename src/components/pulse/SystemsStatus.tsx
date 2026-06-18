"use client";
import { systemsList } from "@/lib/pulse/pulse-data";
export default function SystemsStatus() {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h2 className="font-semibold text-[#1e2d3d] mb-3">Systems Status</h2>
      <p className="text-2xl font-bold text-green-800 mb-2">
        {systemsList.length}/{systemsList.length} Healthy
      </p>
      <div className="grid grid-cols-2 gap-1 text-xs max-h-40 overflow-y-auto">
        {systemsList.map((sys) => (
          <div key={sys} className="flex items-center gap-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <span className="text-[#2c3e50] truncate">{sys}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
