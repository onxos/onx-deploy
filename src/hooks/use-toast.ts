"use client";

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  persistent?: boolean;
  action?: { label: string; onClick: () => void };
};

export type ToastRecord = ToastInput & {
  id: string;
  createdAt: number;
};

let listeners: Array<(toasts: ToastRecord[]) => void> = [];
let toasts: ToastRecord[] = [];

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function toast(input: ToastInput) {
  const record: ToastRecord = {
    duration: 5000,
    variant: "info",
    ...input,
    createdAt: Date.now(),
    id: crypto.randomUUID(),
  };
  toasts = [record, ...toasts].slice(0, 5);
  emit();
  return record.id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

export function subscribeToasts(listener: (records: ToastRecord[]) => void) {
  listeners = [...listeners, listener];
  listener(toasts);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
  };
}

export function useToast() {
  return { dismiss: dismissToast, toast };
}
