"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { useDialogStack } from "./dialog-stack";

export function ModalDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const panelRef = useRef<HTMLDivElement>(null);
  const stack = useDialogStack();

  useEffect(() => {
    if (!open) {
      stack?.remove(id);
      return;
    }
    stack?.push(id);
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (!stack || stack.topId === id)) {
        onOpenChange(false);
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stack?.remove(id);
    };
  }, [id, onOpenChange, open, stack]);

  if (!open) return null;

  return (
    <div
      aria-hidden={!open}
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
      onMouseDown={() => onOpenChange(false)}
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "w-full max-w-lg animate-in rounded-lg border bg-card p-6 text-card-foreground shadow-lg",
          className,
        )}
        onMouseDown={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold" id={titleId}>
            {title}
          </h2>
          {description ? (
            <p className="text-sm text-muted-foreground" id={descriptionId}>
              {description}
            </p>
          ) : null}
        </div>
        <div className="py-5">{children}</div>
        {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
