"use client";

import { useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";

export function CompanionSettings() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="rounded-md border px-3 py-2 text-sm"
        onClick={() => setOpen(true)}
        type="button"
      >
        Companion settings
      </button>
      <ModalDialog
        onOpenChange={setOpen}
        open={open}
        title="Companion settings"
      >
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-4">
            <span>Execution guidance</span>
            <input defaultChecked type="checkbox" />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>Memory summaries</span>
            <input defaultChecked type="checkbox" />
          </label>
        </div>
      </ModalDialog>
    </>
  );
}
