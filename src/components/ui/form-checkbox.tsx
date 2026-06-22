"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormField } from "./form-field";

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
}: {
  name: Path<T>;
  label: string;
}) {
  return (
    <FormField<T> label={label} name={name}>
      {(field) => (
        <input
          checked={Boolean(field.value)}
          id={name}
          onChange={field.onChange}
          type="checkbox"
        />
      )}
    </FormField>
  );
}
