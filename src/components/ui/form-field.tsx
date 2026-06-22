"use client";

import {
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { FormError } from "./form-error";
import { FormLabel } from "./form-label";

function getPathValue(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export function FormField<T extends FieldValues>({
  name,
  label,
  description,
  children,
}: {
  name: Path<T>;
  label: string;
  description?: string;
  children: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const errorObject = getPathValue(errors, name);
  const error =
    errorObject && typeof errorObject === "object" && "message" in errorObject
      ? String(errorObject.message)
      : undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-2">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          {children(field)}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          <FormError>{error}</FormError>
        </div>
      )}
    />
  );
}
