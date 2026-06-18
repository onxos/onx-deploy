"use client";

export default function CivilizationLoading({
  label = "Loading ONX Knowledge...",
}: {
  label?: string;
}) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <p className="text-xs text-[#5a6c7d] pt-2">{label}</p>
    </div>
  );
}
