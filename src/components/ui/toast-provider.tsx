"use client";

import { useEffect, useState } from "react";
import { subscribeToasts, type ToastRecord } from "@/hooks/use-toast";
import { ToastViewport } from "./toast-viewport";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  useEffect(() => subscribeToasts(setToasts), []);

  return (
    <>
      {children}
      <ToastViewport toasts={toasts} />
    </>
  );
}
