export const ROLES = [
  "guest",
  "viewer",
  "operator",
  "editor",
  "admin",
  "founder",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LEVELS: Record<Role, number> = {
  founder: 0,
  admin: 1,
  editor: 2,
  operator: 3,
  viewer: 4,
  guest: 5,
};

export const PERMISSIONS = [
  "admin:read",
  "analytics:read",
  "article:create",
  "article:update",
  "article:delete",
  "gap:update",
  "sech:update",
  "user:delete",
  "user:updateRole",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  founder: PERMISSIONS,
  admin: [
    "admin:read",
    "analytics:read",
    "article:create",
    "article:update",
    "article:delete",
    "gap:update",
    "sech:update",
    "user:delete",
    "user:updateRole",
  ],
  editor: ["analytics:read", "article:create", "article:update", "gap:update"],
  operator: ["article:create", "gap:update", "sech:update"],
  viewer: ["analytics:read"],
  guest: [],
};

export function isRole(role: string | null | undefined): role is Role {
  return ROLES.includes(role as Role);
}

export function normalizeRole(role: string | null | undefined): Role {
  return isRole(role) ? role : "operator";
}

export function hasMinimumRole(
  userRole: string | null | undefined,
  requiredRole: Role,
) {
  return ROLE_LEVELS[normalizeRole(userRole)] <= ROLE_LEVELS[requiredRole];
}

export function hasPermission(
  userRole: string | null | undefined,
  permission: Permission,
) {
  return ROLE_PERMISSIONS[normalizeRole(userRole)].includes(permission);
}
