import { hasRequiredRole } from "@/server/auth/roles";

const protectedRoutes = ["/pulse", "/registry", "/gaps", "/admin"];
const adminRoutes = ["/registry", "/gaps", "/admin"];

function isRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function routeDecision(pathname: string, session: boolean, role = "operator") {
  if (!isRoute(pathname, protectedRoutes)) return "next";
  if (!session) return `redirect:/login?callbackUrl=${pathname}`;
  if (isRoute(pathname, adminRoutes) && !hasRequiredRole(role, "admin")) {
    return "redirect:/forbidden";
  }
  return "next";
}

const scenarios = [
  {
    id: "WP-F-04-public-route-passes",
    actual: routeDecision("/knowledge", false),
    expected: "next",
  },
  {
    id: "WP-F-04-pulse-unauthenticated-login",
    actual: routeDecision("/pulse", false),
    expected: "redirect:/login?callbackUrl=/pulse",
  },
  {
    id: "WP-F-04-pulse-operator-allowed",
    actual: routeDecision("/pulse", true, "operator"),
    expected: "next",
  },
  {
    id: "WP-F-04-registry-operator-forbidden",
    actual: routeDecision("/registry", true, "operator"),
    expected: "redirect:/forbidden",
  },
  {
    id: "WP-F-04-gaps-admin-allowed",
    actual: routeDecision("/gaps", true, "admin"),
    expected: "next",
  },
  {
    id: "WP-F-04-admin-founder-allowed",
    actual: routeDecision("/admin/titans", true, "founder"),
    expected: "next",
  },
];

const results = scenarios.map((scenario) => ({
  ...scenario,
  ok: scenario.actual === scenario.expected,
}));
const failed = results.filter((result) => !result.ok);

console.log(
  JSON.stringify({ scenarioCount: results.length, results }, null, 2),
);

if (failed.length > 0) {
  console.error("route protection scenario failures:");
  for (const failure of failed) {
    console.error(
      `- ${failure.id}: expected ${failure.expected}, got ${failure.actual}`,
    );
  }
  process.exit(1);
}
