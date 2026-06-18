"use client";

import { useEffect, useState } from "react";
import { versionString } from "@/lib/pulse/pulse-data";
import { api } from "@/trpc/react";
import CommunityMetrics from "./CommunityMetrics";
import PreservationScore from "./PreservationScore";
import SechActivity from "./SechActivity";
import SystemsStatus from "./SystemsStatus";

export default function PulseDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { data: pulse, refetch } =
    api.analytics.getCivilizationPulse.useQuery();
  const { data: sechStatus } = api.sech.getCurrentStatus.useQuery();
  const { data: gapSummary } = api.gap.getGapSummary.useQuery();

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      void refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SystemsStatus />
        <PreservationScore />
        <SechActivity sechStatus={sechStatus} />
        <CommunityMetrics pulse={pulse} />
      </div>
      {gapSummary && (
        <div className="mt-4 p-3 bg-white border rounded-lg text-sm text-[#5a6c7d]">
          Gap Board: {gapSummary.total} total SBPs tracked across{" "}
          {gapSummary.byCategory.length} categories
        </div>
      )}
      <div className="mt-4 p-3 bg-[#1e2d3d] text-white rounded-lg text-center text-sm">
        {versionString} | Last Updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}
