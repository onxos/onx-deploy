# ONX Staging Monitoring Plan

## Endpoints

- `/api/health`: liveness
- `/api/health/ready`: database and memory readiness
- `/api/health/db`: database-specific check
- `/api/metrics`: Prometheus-style process metrics

## Checks

- Poll `/api/health` every 60 seconds.
- Poll `/api/health/ready` every 60 seconds.
- Run `bun run test:staging` after every staging deploy.

## Dashboard Inputs

- HTTP status for health endpoints
- container uptime and restart count
- heap usage from `/api/metrics`
- database readiness status

This is enough for staging readiness. Production monitoring remains a separate gate.
