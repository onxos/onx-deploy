"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormField } from "./form-field";

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  maxLength,
}: {
  name: Path<T>;
  label: string;
  maxLength?: number;
}) {
  return (
    <FormField<T> label={label} name={name}>
      {(field) => (
        <div className="space-y-1">
          <textarea
            {...field}
            className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
            id={name}
            maxLength={maxLength}
            value={field.value ?? ""}
          />
          {maxLength ? (
            <p className="text-right text-xs text-muted-foreground">
              {String(field.value ?? "").length}/{maxLength}
            </p>
          ) : null}
        </div>
      )}
    </FormField>
  );
}
