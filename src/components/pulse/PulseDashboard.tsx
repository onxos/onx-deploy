"use client";
import { useEffect, useState } from "react";
import { versionString } from "@/lib/pulse/pulse-data";
import CommunityMetrics from "./CommunityMetrics";
import PreservationScore from "./PreservationScore";
import SechActivity from "./SechActivity";
import SystemsStatus from "./SystemsStatus";
export default function PulseDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SystemsStatus />
        <PreservationScore />
        <SechActivity />
        <CommunityMetrics />
      </div>
      <div className="mt-4 p-3 bg-[#1e2d3d] text-white rounded-lg text-center text-sm">
        {versionString} | Last Updated: {lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
}
