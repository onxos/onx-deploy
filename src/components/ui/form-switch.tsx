"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormField } from "./form-field";

export function FormSwitch<T extends FieldValues>({
  name,
  label,
}: {
  name: Path<T>;
  label: string;
}) {
  return (
    <FormField<T> label={label} name={name}>
      {(field) => (
        <button
          aria-checked={Boolean(field.value)}
          className="rounded-full border px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          data-state={field.value ? "on" : "off"}
          id={name}
          onClick={() => field.onChange(!field.value)}
          role="switch"
          type="button"
        >
          {field.value ? "On" : "Off"}
        </button>
      )}
    </FormField>
  );
}
