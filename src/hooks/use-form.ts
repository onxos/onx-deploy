"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type DefaultValues,
  type FieldValues,
  type Resolver,
  useForm as useHookForm,
} from "react-hook-form";
import type { z } from "zod";

export function useForm<TFieldValues extends FieldValues>({
  schema,
  defaultValues,
}: {
  schema: z.ZodType<TFieldValues>;
  defaultValues: DefaultValues<TFieldValues>;
}) {
  const form = useHookForm<TFieldValues, unknown, TFieldValues>({
    defaultValues,
    resolver: zodResolver(schema as never) as Resolver<
      TFieldValues,
      unknown,
      TFieldValues
    >,
  });

  return {
    ...form,
    dirty: form.formState.isDirty,
    resetForm: () => form.reset(defaultValues),
  };
}
