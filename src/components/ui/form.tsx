"use client";

import {
  type FieldValues,
  FormProvider,
  type UseFormReturn,
} from "react-hook-form";
import { cn } from "@/lib/utils";

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FormProvider {...form}>
      <form
        className={cn("space-y-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export function FormGrid({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)} {...props} />
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FormButton({
  loading,
  children = "Submit",
}: {
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60"
      disabled={loading}
      type="submit"
    >
      {loading ? "Submitting..." : children}
    </button>
  );
}
