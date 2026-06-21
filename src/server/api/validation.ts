import { z } from "zod";

export const nonEmptyTrimmedString = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength);

export const optionalTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

export const canonicalSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(256)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must use lowercase letters, numbers, and hyphens",
  });

export const pagePathSchema = z
  .string()
  .trim()
  .min(1)
  .max(256)
  .regex(/^\/[A-Za-z0-9/_?.=&-]*$/, {
    message: "Page must be a relative path beginning with /",
  });

export const boundedDateRangeSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .superRefine((input, ctx) => {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      ctx.addIssue({
        code: "custom",
        message: "startDate must be before or equal to endDate",
        path: ["startDate"],
      });
    }
  });
