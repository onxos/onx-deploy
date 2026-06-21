import { z } from "zod";
import { badRequest } from "@/server/api/errors";

export const analyticsMetricSchema = z.enum([
  "pageViews",
  "events",
  "errors",
  "sessions",
]);

export const analyticsGranularitySchema = z.enum([
  "daily",
  "weekly",
  "monthly",
]);

export const analyticsQueryInputSchema = z
  .strictObject({
    metric: analyticsMetricSchema.default("pageViews"),
    granularity: analyticsGranularitySchema.default("daily"),
    limit: z.number().int().min(1).max(366).default(90),
    offset: z.number().int().min(0).default(0),
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

export type AnalyticsQueryInput = z.infer<typeof analyticsQueryInputSchema>;
export type AnalyticsMetric = z.infer<typeof analyticsMetricSchema>;
export type AnalyticsGranularity = z.infer<typeof analyticsGranularitySchema>;

export function getDateTruncUnit(granularity: AnalyticsGranularity) {
  switch (granularity) {
    case "daily":
      return "day";
    case "weekly":
      return "week";
    case "monthly":
      return "month";
  }
}

export function getMetricDescription(metric: AnalyticsMetric) {
  switch (metric) {
    case "pageViews":
      return "count of page view interactions";
    case "events":
      return "count of all tracked visitor interactions";
    case "errors":
      return "count of error interactions";
    case "sessions":
      return "count of distinct visitor sessions";
  }
}

export function assertAnalyticsDateRange(input: AnalyticsQueryInput) {
  if (input.startDate && input.endDate && input.startDate > input.endDate) {
    throw badRequest("startDate must be before or equal to endDate");
  }
}
