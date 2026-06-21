# ONX Staging Deployment Plan

## Scope

This plan proves staging readiness only. It does not authorize production deployment.

## Target

- Platform: Coolify staging resource
- Runtime: Next.js 16 App Router on Bun container
- Database: isolated Neon/Postgres staging database or staging branch
- Port: `STAGING_PORT`, default `3000`
- Health: `/api/health`
- Readiness: `/api/health/ready`
- Domain: `https://staging.onx.dev`

## Required Environment

Staging secrets are managed in the Coolify UI, not committed `.env` files.
Use `.env.staging.example` only as the variable checklist.

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `ONX_FOUNDER_EMAIL`
- `ONX_FOUNDER_PASSWORD`
- `ONX_FOUNDER_NAME`

## Deployment Commands

Canonical deployment is GitHub Actions -> GHCR image -> Coolify pull. Push to
the `staging` branch after verification passes:

```bash
git push origin staging
```

GitHub Actions publishes:

- `ghcr.io/onxos/onx-deploy:staging-<COMMIT_SHA>`
- `ghcr.io/onxos/onx-deploy:staging-latest`

Coolify uses `docker-compose.yml` at the repo root and deploys the pushed image.
The local `scripts/deploy-staging.sh` remains a pre-server fallback only.

## Verification

```bash
bun run test:staging
curl -fsS "$ONX_BASE_URL/api/health"
curl -fsS "$ONX_BASE_URL/api/health/ready"
```

## Rollback

Use Coolify Deployments -> Rollback on the previous successful deployment. For
local fallback testing, keep the last known-good image tagged as
`ghcr.io/onxos/onx-deploy:staging-previous`.

```bash
ROLLBACK_IMAGE_TAG=ghcr.io/onxos/onx-deploy:staging-previous bash scripts/rollback-staging.sh
```

## Staging Decision Rule

Staging is ready when lint, readiness evidence check, build, image publish,
Coolify deployment, health, and smoke checks pass against the isolated staging
database.
