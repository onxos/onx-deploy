const ADMIN_COOKIE = "admin_access_token";
const ADMIN_HEADER = "x-admin-token";

function getAdminToken() {
  const token = process.env.ADMIN_ACCESS_TOKEN;

  if (!token) {
    throw new Error("ADMIN_ACCESS_TOKEN is required for admin access");
  }

  return token;
}

function parseCookieToken(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const adminCookie = cookies.find((cookie) =>
    cookie.startsWith(`${ADMIN_COOKIE}=`),
  );

  if (!adminCookie) return null;

  return decodeURIComponent(adminCookie.slice(ADMIN_COOKIE.length + 1));
}

export function hasAdminAccessFromHeaders(headers: Headers | undefined) {
  if (!headers) return false;

  const expectedToken = getAdminToken();
  const headerToken = headers.get(ADMIN_HEADER);
  const cookieToken = parseCookieToken(headers.get("cookie"));

  return headerToken === expectedToken || cookieToken === expectedToken;
}

export function hasAdminAccessToken(token: string | undefined) {
  return Boolean(token && token === getAdminToken());
}

export const adminAccessCookieName = ADMIN_COOKIE;
