"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormField } from "./form-field";

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
}: {
  name: Path<T>;
  label: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <FormField<T> label={label} name={name}>
      {(field) => (
        <select
          {...field}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          id={name}
          value={field.value ?? ""}
        >
          <option value="">Select...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
