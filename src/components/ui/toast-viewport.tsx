"use client";

import type { ToastRecord } from "@/hooks/use-toast";
import { ToastItem } from "./toast-item";

export function ToastViewport({ toasts }: { toasts: ToastRecord[] }) {
  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
