"use client";

import { useEffect } from "react";
import { dismissToast, type ToastRecord } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ToastAction } from "./toast-action";
import { ToastProgress } from "./toast-progress";

const variantClass = {
  error: "border-destructive text-destructive",
  info: "border-border",
  success: "border-emerald-600 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-600 text-amber-700 dark:text-amber-300",
};

export function ToastItem({ toast }: { toast: ToastRecord }) {
  useEffect(() => {
    if (toast.persistent) return;
    const timer = window.setTimeout(
      () => dismissToast(toast.id),
      toast.duration ?? 5000,
    );
    return () => window.clearTimeout(timer);
  }, [toast.duration, toast.id, toast.persistent]);

  return (
    <output
      aria-live="polite"
      className={cn(
        "relative overflow-hidden rounded-md border bg-card p-4 text-card-foreground shadow-lg",
        variantClass[toast.variant ?? "info"],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{toast.title}</p>
          {toast.description ? (
            <p className="text-sm text-muted-foreground">{toast.description}</p>
          ) : null}
        </div>
        <button
          aria-label="Dismiss toast"
          onClick={() => dismissToast(toast.id)}
          type="button"
        >
          x
        </button>
      </div>
      {toast.action ? (
        <div className="mt-3">
          <ToastAction {...toast.action} />
        </div>
      ) : null}
      {!toast.persistent ? <ToastProgress duration={toast.duration} /> : null}
    </output>
  );
}
