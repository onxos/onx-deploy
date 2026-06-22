"use client";

import { ModalDialog } from "./modal-dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const answer = (result: boolean) => {
    onConfirm(result);
    onOpenChange(false);
  };

  return (
    <ModalDialog
      footer={
        <>
          <button
            className="rounded-md border px-4 py-2"
            onClick={() => answer(false)}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => answer(true)}
            type="button"
          >
            {confirmLabel}
          </button>
        </>
      }
      onOpenChange={onOpenChange}
      open={open}
      title={title}
      description={description}
    >
      <span className="sr-only">Choose cancel or confirm</span>
    </ModalDialog>
  );
}
