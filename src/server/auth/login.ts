import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@/server/auth";
import { normalizeRole } from "@/server/auth/roles";

export const loginInputSchema = z.strictObject({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginResult = {
  token: string;
  user: AuthenticatedUser;
};

function toUnauthorized(): TRPCError {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message: "Invalid email or password",
  });
}

export function toLoginBody(input: LoginInput) {
  return {
    email: input.email.toLowerCase(),
    password: input.password,
  };
}

export function toPublicUser(user: {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
}): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? "",
    role: normalizeRole(user.role),
  };
}

export async function loginWithEmailPassword(input: LoginInput) {
  try {
    const result = await auth.api.signInEmail({
      body: toLoginBody(input),
    });

    if (!result.token || !result.user) {
      throw toUnauthorized();
    }

    return {
      token: result.token,
      user: toPublicUser(result.user),
    } satisfies LoginResult;
  } catch {
    throw toUnauthorized();
  }
}
