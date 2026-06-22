"use client";

import { createContext, useContext, useMemo, useState } from "react";

type DialogStackContextValue = {
  topId: string | null;
  push: (id: string) => void;
  remove: (id: string) => void;
};

const DialogStackContext = createContext<DialogStackContextValue | null>(null);

export function DialogStackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stack, setStack] = useState<string[]>([]);
  const value = useMemo(
    () => ({
      topId: stack.at(-1) ?? null,
      push: (id: string) =>
        setStack((current) => [...current.filter((item) => item !== id), id]),
      remove: (id: string) =>
        setStack((current) => current.filter((item) => item !== id)),
    }),
    [stack],
  );

  return (
    <DialogStackContext.Provider value={value}>
      {children}
    </DialogStackContext.Provider>
  );
}

export function useDialogStack() {
  return useContext(DialogStackContext);
}
