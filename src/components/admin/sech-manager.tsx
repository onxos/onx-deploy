"use client";

import { useRef } from "react";
import { api } from "@/trpc/react";

const statuses = ["clear", "advisory", "alert", "veto"] as const;
type SechStatus = (typeof statuses)[number];

function isSechStatus(status: string): status is SechStatus {
  return statuses.includes(status as SechStatus);
}

export default function SechManager() {
  const { data: layers, refetch } = api.sech.getCurrentStatus.useQuery(
    undefined,
    { refetchInterval: 30000 },
  );
  const setLayerStatus = api.sech.setLayerStatus.useMutation();
  const draftsRef = useRef<Record<string, string>>({});

  return (
    <section className="rounded border bg-white p-4">
      <h3 className="font-bold text-[#1e2d3d]">SECH Manager</h3>
      <div className="mt-4 space-y-3">
        {(layers ?? []).map((layer) => (
          <div key={layer.layer} className="rounded border p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-[#1e2d3d]">{layer.layer}</p>
                <p className="text-xs text-[#5a6c7d]">
                  {layer.message ?? "No message"}
                </p>
              </div>
              <select
                aria-label={`Status for SECH layer ${layer.layer}`}
                defaultValue={layer.status}
                onChange={(event) => {
                  draftsRef.current = {
                    ...draftsRef.current,
                    [`${layer.layer}:status`]: event.target.value,
                  };
                }}
                className="rounded border px-3 py-2 text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              aria-label={`Message for SECH layer ${layer.layer}`}
              placeholder="Status message"
              onChange={(event) => {
                draftsRef.current = {
                  ...draftsRef.current,
                  [`${layer.layer}:message`]: event.target.value,
                };
              }}
              className="mt-3 w-full rounded border px-3 py-2 text-sm"
              rows={2}
            />
            <button
              type="button"
              onClick={async () => {
                const drafts = draftsRef.current;
                const nextStatus =
                  drafts[`${layer.layer}:status`] ?? layer.status;
                await setLayerStatus.mutateAsync({
                  layer: layer.layer as "S" | "E" | "C" | "H" | "Council",
                  status: isSechStatus(nextStatus) ? nextStatus : "clear",
                  message:
                    drafts[`${layer.layer}:message`] ||
                    layer.message ||
                    undefined,
                  triggeredBy: "admin",
                });
                void refetch();
              }}
              className="mt-3 rounded bg-[#c9a84c] px-3 py-1.5 text-xs font-semibold text-[#1e2d3d]"
            >
              Save Layer
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
