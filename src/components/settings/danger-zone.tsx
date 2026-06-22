"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/hooks/use-toast";

export function DangerZone() {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-lg border border-destructive/40 bg-card p-5">
      <h2 className="font-semibold text-destructive">Danger zone</h2>
      <p className="text-sm text-muted-foreground">
        Sign out all devices only after confirmation.
      </p>
      <button
        className="mt-4 rounded-md border border-destructive px-3 py-2 text-sm text-destructive"
        onClick={() => setOpen(true)}
        type="button"
      >
        Sign out all devices
      </button>
      <ConfirmDialog
        description="This signs out all active sessions."
        onConfirm={(confirmed) => {
          if (confirmed)
            toast({ title: "All sessions signed out", variant: "warning" });
        }}
        onOpenChange={setOpen}
        open={open}
        title="Confirm sign out all devices"
      />
    </section>
  );
}
