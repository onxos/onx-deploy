"use client";
import { useEffect, useState } from "react";
import { sechMetrics } from "@/lib/pulse/pulse-data";
export default function SentinelBadge() {
  const [metrics, setMetrics] = useState(sechMetrics);
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        ethicsChecksPassed: prev.ethicsChecksPassed + 1,
      }));
      setPulse((p) => !p);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full text-white py-2 px-4 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full bg-green-400 ${pulse ? "animate-pulse" : ""}`}
        />
        <span className="font-semibold text-[#c9a84c]">SECH ACTIVE</span>
      </div>
      <div className="flex items-center gap-4">
        <span>
          {metrics.ethicsChecksPassed.toLocaleString()} ethical checks passed
        </span>
        <span>{metrics.memoryPreservedPercent}% memory preserved</span>
        <span className="text-green-300">{metrics.harmonyStatus}</span>
      </div>
    </div>
  );
}
