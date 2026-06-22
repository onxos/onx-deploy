"use client";

import type { FieldValues, Path } from "react-hook-form";
import { FormField } from "./form-field";

export function FormRadioGroup<T extends FieldValues>({
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
        <div className="space-y-2" role="radiogroup">
          {options.map((option) => (
            <label
              className="flex items-center gap-2 text-sm"
              key={option.value}
            >
              <input
                checked={field.value === option.value}
                name={field.name}
                onChange={() => field.onChange(option.value)}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </FormField>
  );
}
