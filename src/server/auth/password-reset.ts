import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@/server/auth";

export const passwordResetRequestInputSchema = z
  .object({
    email: z.email().max(254),
    redirectTo: z.string().min(1).max(512).optional(),
  })
  .strict();

export const passwordResetInputSchema = z
  .object({
    token: z.string().min(16).max(512),
    newPassword: z.string().min(12).max(128),
  })
  .strict();

export type PasswordResetRequestInput = z.infer<
  typeof passwordResetRequestInputSchema
>;
export type PasswordResetInput = z.infer<typeof passwordResetInputSchema>;

export type CapturedPasswordResetLink = {
  userId: string;
  email: string;
  url: string;
  token: string | null;
  createdAt: Date;
};

const capturedResetLinks: CapturedPasswordResetLink[] = [];

export function capturePasswordResetLink(input: {
  user: { id: string; email: string };
  url: string;
}) {
  const token = input.url.match(/\/reset-password\/([^?]+)/)?.[1] ?? null;
  capturedResetLinks.unshift({
    userId: input.user.id,
    email: input.user.email,
    url: input.url,
    token,
    createdAt: new Date(),
  });
}

export function getCapturedPasswordResetLinks() {
  return capturedResetLinks.slice(0, 20);
}

export function toPasswordResetRequestBody(
  input: PasswordResetRequestInput,
  baseUrl: string,
) {
  return {
    email: input.email.toLowerCase(),
    redirectTo: input.redirectTo ?? `${baseUrl}/reset-password`,
  };
}

export async function requestPasswordReset(
  input: PasswordResetRequestInput,
  baseUrl: string,
) {
  try {
    await auth.api.requestPasswordReset({
      body: toPasswordResetRequestBody(input, baseUrl),
    });
  } catch {
    // Keep account existence private: callers always receive the same response.
  }

  return { ok: true as const };
}

export async function resetPassword(input: PasswordResetInput) {
  try {
    await auth.api.resetPassword({
      body: {
        token: input.token,
        newPassword: input.newPassword,
      },
    });
    return { ok: true as const };
  } catch {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Password reset token is invalid or expired",
    });
  }
}
