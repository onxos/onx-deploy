import { TRPCError } from "@trpc/server";

type StandardErrorCode =
  | "BAD_REQUEST"
  | "CONFLICT"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED";

const USER_FRIENDLY_MESSAGES: Record<StandardErrorCode, string> = {
  BAD_REQUEST: "The request is invalid",
  CONFLICT: "The request conflicts with existing data",
  FORBIDDEN: "You do not have permission to perform this action",
  INTERNAL_SERVER_ERROR: "Something went wrong",
  NOT_FOUND: "The requested resource was not found",
  UNAUTHORIZED: "Authentication required",
};

export function createApiError(options: {
  code: StandardErrorCode;
  message?: string;
  cause?: unknown;
}) {
  if (options.cause) {
    console.error("[api-error]", {
      code: options.code,
      message: options.message ?? USER_FRIENDLY_MESSAGES[options.code],
      cause: options.cause,
    });
  }

  return new TRPCError({
    code: options.code,
    message: options.message ?? USER_FRIENDLY_MESSAGES[options.code],
    cause: options.cause,
  });
}

export function notFound(resource: string) {
  return createApiError({
    code: "NOT_FOUND",
    message: `${resource} not found`,
  });
}

export function forbidden(message?: string) {
  return createApiError({
    code: "FORBIDDEN",
    message,
  });
}

export function badRequest(message?: string) {
  return createApiError({
    code: "BAD_REQUEST",
    message,
  });
}
