"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormField } from "./form-field";

export function FormInput<T extends FieldValues>({
  name,
  label,
  description,
  type = "text",
}: {
  name: Path<T>;
  label: string;
  description?: string;
  type?: string;
}) {
  return (
    <FormField<T> description={description} label={label} name={name}>
      {(field) => (
        <input
          {...field}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          id={name}
          type={type}
          value={field.value ?? ""}
        />
      )}
    </FormField>
  );
}
