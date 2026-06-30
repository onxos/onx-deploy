# PLATFORM-PROD-01 Production Checklist

Date: 2026-06-30
Repository: onxos/onx-deploy
Branch: exec/platform-prod-01

| Check | Status | Evidence |
|---|---|---|
| Docker environment | PASS | docker available; images/containers started for verification |
| Compose files syntax | PASS | docker compose config succeeded for docker-compose.yml and docker-compose.staging.yml |
| Runtime configuration | PASS | app starts in production mode via bun run start with required env |
| Environment variables | PASS | required vars identified and used in compose/app startup checks |
| Database migration state | PASS | bun run db:migrate succeeded against local postgres |
| Application startup | PASS (source runtime) / FAIL (compose build path) | source startup succeeded; compose --build app failed with SIGTERM during next build |
| Health endpoints | PASS | /api/health HTTP 200 |
| Readiness endpoints | PASS after fix | /api/health/ready HTTP 200 with DB up after readiness gate fix |
| Nginx configuration | PASS | nginx starts in compose stack; proxy routes active |
| Production configuration | PASS | NODE_ENV production path validated |
| Secrets handling | PASS with warnings | secrets consumed from env; BETTER_AUTH_SECRET strength warnings shown when weak test secret used |
| Logging | PASS | docker compose logs available for app/nginx/postgres |
| Monitoring hooks | PASS | /api/metrics HTTP 200 with Prometheus-style payload |
| Recovery procedures | PASS | rollback and incident/runbook docs present and executable fallback scripts present |
| Production documentation | PARTIAL | staging-focused docs present; no separate production-only runbook set |

## Critical Result
- Critical blocker remains on compose app build path in this environment: Next.js build worker exits with SIGTERM during `docker compose up --build` for app service.
