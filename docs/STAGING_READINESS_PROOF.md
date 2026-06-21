# ONX EP-01 Staging Readiness Proof

## Decision

Status: `STAGING_READY_FOR_VALIDATION`

This repo is ready to deploy to staging and validate there. It is not production ready and does not claim production authorization.

## Wave 1: Immediate Blocker Closure

Status: ready.

- Authentication exists through Better Auth at `/api/auth/[...all]`.
- Login UI exists at `/login`.
- Protected unauthenticated routes redirect to `/login`.
- Role helpers support `operator`, `admin`, and `founder`.
- `/pulse` requires a session.
- `/registry`, `/gaps`, and `/admin` require admin-or-founder.
- tRPC protected procedures require authenticated admin-or-founder.
- Founder bootstrap script exists.

Evidence:

- `src/server/auth.ts`
- `src/server/auth/roles.ts`
- `src/app/api/auth/[...all]/route.ts`
- `src/app/login/page.tsx`
- `middleware.ts`
- `scripts/bootstrap-founder.ts`

## Wave 2: Deployment Foundation

Status: ready for staging.

- Build command passes: `bun run build`.
- Lint command passes: `bun run lint`.
- Readiness evidence check exists: `bun run test`.
- CI workflow exists: `.github/workflows/ci.yml`.
- Container build path exists: `Dockerfile`.
- Local staging compose exists: `docker-compose.staging.yml`.
- Staging deploy and rollback scripts exist.

Evidence:

- `.github/workflows/ci.yml`
- `Dockerfile`
- `docker-compose.staging.yml`
- `scripts/deploy-staging.sh`
- `scripts/rollback-staging.sh`
- `scripts/staging-readiness-check.ts`
- `scripts/staging-smoke.ts`

## Wave 3: Operational Hardening

Status: ready for staging.

- Liveness endpoint exists: `/api/health`.
- Readiness endpoint exists: `/api/health/ready`.
- Database health endpoint exists: `/api/health/db`.
- Metrics endpoint exists: `/api/metrics`.
- Runbooks and incident response docs exist.
- Staging monitoring and escalation docs exist.

Evidence:

- `src/app/api/health/route.ts`
- `src/app/api/health/ready/route.ts`
- `src/app/api/health/db/route.ts`
- `src/app/api/metrics/route.ts`
- `docs/ONX_RUNBOOKS.md`
- `docs/INCIDENT_RESPONSE.md`
- `docs/MONITORING_PLAN.md`
- `docs/ALERT_ESCALATION.md`
- `docs/SUPPORT_OWNERSHIP.md`

## Wave 4: Staging Readiness Decision

Status: ready to execute on a staging target.

- Staging deployment plan exists.
- Post-deploy checklist exists.
- Staging smoke script exists.
- Health and auth checks are defined.
- Database migration artifact exists.

Evidence:

- `docs/STAGING_DEPLOYMENT_PLAN.md`
- `docs/POST_DEPLOY_CHECKLIST.md`
- `docs/STAGING_READINESS_PROOF.md`
- `drizzle/0000_real_unicorn.sql`

## Commands Executed Locally

```bash
bun run lint
bun run test
bun run build
```

## Boundary

This proof demonstrates staging readiness for validation. It does not prove:

- production readiness
- production monitoring
- production backup/restore
- production incident response
- production authorization
