import { headers } from "next/headers";
import { auth } from "@/server/auth";
import {
  hasMinimumRole,
  normalizeRole as normalizeRbacRole,
  ROLES,
  type Role,
} from "@/server/auth/rbac";

export const authRoles = ROLES;
export type AuthRole = Role;

export function normalizeRole(role: string | null | undefined): AuthRole {
  return normalizeRbacRole(role);
}

export function hasRequiredRole(
  role: string | null | undefined,
  minimumRole: AuthRole,
) {
  return hasMinimumRole(role, minimumRole);
}

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getCurrentUserRole() {
  const session = await getCurrentSession();
  return session?.user.role ? normalizeRole(session.user.role) : null;
}
