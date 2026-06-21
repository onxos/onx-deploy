import { auth } from "@/server/auth";

export async function logoutFromHeaders(headers: Headers) {
  await auth.api.signOut({ headers });

  return {
    ok: true as const,
  };
}
