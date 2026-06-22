"use client";

import { ModalDialog } from "./modal-dialog";

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = "OK",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  actionLabel?: string;
}) {
  return (
    <ModalDialog
      footer={
        <button
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => onOpenChange(false)}
          type="button"
        >
          {actionLabel}
        </button>
      }
      onOpenChange={onOpenChange}
      open={open}
      title={title}
      description={description}
    >
      <span className="sr-only">Alert requires acknowledgement</span>
    </ModalDialog>
  );
}
