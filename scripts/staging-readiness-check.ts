import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  ".env.example",
  ".github/workflows/ci.yml",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.staging.yml",
  "drizzle/0000_real_unicorn.sql",
  "middleware.ts",
  "scripts/bootstrap-founder.ts",
  "scripts/deploy-staging.sh",
  "scripts/rollback-staging.sh",
  "src/app/api/auth/[...all]/route.ts",
  "src/app/api/health/route.ts",
  "src/app/api/health/ready/route.ts",
  "src/app/api/health/db/route.ts",
  "src/app/api/metrics/route.ts",
  "src/app/login/page.tsx",
  "src/app/forbidden/page.tsx",
  "src/server/auth.ts",
  "src/server/auth/roles.ts",
  "src/server/db/schema/auth.ts",
  "docs/STAGING_DEPLOYMENT_PLAN.md",
  "docs/POST_DEPLOY_CHECKLIST.md",
  "docs/ONX_RUNBOOKS.md",
  "docs/INCIDENT_RESPONSE.md",
  "docs/SUPPORT_OWNERSHIP.md",
  "docs/ALERT_ESCALATION.md",
  "docs/MONITORING_PLAN.md",
  "docs/STAGING_READINESS_PROOF.md",
];

const envExample = readFileSync(".env.example", "utf8");
const requiredEnv = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "ONX_FOUNDER_EMAIL",
  "ONX_FOUNDER_PASSWORD",
];

const failures = [
  ...requiredFiles
    .filter((file) => !existsSync(file))
    .map((file) => `missing file: ${file}`),
  ...requiredEnv
    .filter((key) => !envExample.includes(key))
    .map((key) => `missing env example: ${key}`),
];

if (failures.length > 0) {
  console.error("Staging readiness check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Staging readiness evidence files present.");
