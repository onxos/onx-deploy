"use client";

import {
  type ConfidenceLevel,
  confidenceLevels,
  type UnderstandingType,
  understandingTypes,
} from "@/lib/validations/workspace";

export function WorkspaceFilters({
  confidence,
  setConfidence,
  setType,
  type,
}: {
  confidence: ConfidenceLevel | "All";
  setConfidence: (value: ConfidenceLevel | "All") => void;
  setType: (value: UnderstandingType | "All") => void;
  type: UnderstandingType | "All";
}) {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap gap-2">
        {(["All", ...understandingTypes] as const).map((item) => (
          <button
            className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={type === item}
            key={item}
            onClick={() => setType(item)}
            type="button"
          >
            Type: {item}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(["All", ...confidenceLevels] as const).map((item) => (
          <button
            className="rounded-full border px-3 py-1 text-sm data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
            data-active={confidence === item}
            key={item}
            onClick={() => setConfidence(item)}
            type="button"
          >
            Confidence: {item}
          </button>
        ))}
      </div>
    </div>
  );
}
