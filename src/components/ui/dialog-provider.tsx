"use client";

import { DialogStackProvider } from "./dialog-stack";

export function DialogProvider({ children }: { children: React.ReactNode }) {
  return <DialogStackProvider>{children}</DialogStackProvider>;
}
