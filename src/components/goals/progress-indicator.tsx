"use client";

export function ProgressIndicator({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>Progress indicator</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
