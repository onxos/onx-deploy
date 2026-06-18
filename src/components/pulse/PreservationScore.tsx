"use client";
import { preservationScore } from "@/lib/pulse/pulse-data";
export default function PreservationScore() {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold text-[#1e2d3d] mb-3">
        Knowledge Preservation
      </h3>
      <div className="text-center">
        <p className="text-4xl font-bold text-[#c9a84c]">
          {preservationScore}%
        </p>
        <div className="w-full h-3 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-[#c9a84c] rounded-full transition-all"
            style={{ width: `${preservationScore}%` }}
          />
        </div>
        <p className="text-xs text-[#5a6c7d] mt-2">
          Approved scope coverage after Option C+
        </p>
      </div>
    </div>
  );
}
