"use client";

import { useCallback, useState } from "react";

export function useDialog(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  return {
    close: useCallback(() => setOpen(false), []),
    open,
    openDialog: useCallback(() => setOpen(true), []),
    setOpen,
    toggle: useCallback(() => setOpen((value) => !value), []),
  };
}

export function createConfirmController() {
  let resolve: ((value: boolean) => void) | null = null;
  return {
    ask() {
      return new Promise<boolean>((next) => {
        resolve = next;
      });
    },
    answer(value: boolean) {
      resolve?.(value);
      resolve = null;
    },
  };
}
