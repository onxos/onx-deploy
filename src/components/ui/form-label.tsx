"use client";

import { cn } from "@/lib/utils";

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: FormField provides htmlFor dynamically through props.
    <label
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}
