"use client";
import { communityMetrics } from "@/lib/pulse/pulse-data";
export default function CommunityMetrics() {
  const items = [
    { label: "Total Users", value: communityMetrics.totalUsers },
    { label: "Active Clinics", value: communityMetrics.activeClinics },
    { label: "Conversations", value: communityMetrics.conversations },
    { label: "Contributions", value: communityMetrics.contributions },
  ];
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold text-[#1e2d3d] mb-3">Community</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.label} className="text-center p-2">
            <p className="text-2xl font-bold text-[#c9a84c]">
              {item.value.toLocaleString()}
            </p>
            <p className="text-xs text-[#5a6c7d] mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
