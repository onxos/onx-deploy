import { TRPCError } from "@trpc/server";
import { auth } from "@/server/auth";
import { toPublicUser } from "@/server/auth/login";

export type PublicSession = {
  token: string;
  expiresAt: Date;
  user: ReturnType<typeof toPublicUser>;
};

export function toPublicSession(
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>,
) {
  return {
    token: session.session.token,
    expiresAt: session.session.expiresAt,
    user: toPublicUser(session.user),
  } satisfies PublicSession;
}

export async function getSessionFromHeaders(headers: Headers) {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  return toPublicSession(session);
}

export async function refreshSessionFromHeaders(headers: Headers) {
  return getSessionFromHeaders(headers);
}
