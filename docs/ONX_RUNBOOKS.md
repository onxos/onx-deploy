# ONX Staging Runbooks

## Start Staging

Canonical path:

```bash
git push origin staging
```

Coolify should pull the GHCR image published by GitHub Actions and deploy it
from root `docker-compose.yml`.

Local fallback:

```bash
bash scripts/deploy-staging.sh
```

## Stop Staging

Use Coolify dashboard -> Stop. Local fallback:

```bash
docker compose -f docker-compose.yml down
```

## Restart Staging

Use Coolify dashboard -> Restart. Local fallback:

```bash
docker compose -f docker-compose.yml up -d
```

## Check Health

```bash
curl -fsS "$ONX_BASE_URL/api/health"
curl -fsS "$ONX_BASE_URL/api/health/ready"
```

## View Logs

Use Coolify dashboard -> Logs. Local fallback:

```bash
docker compose -f docker-compose.yml logs -f onx
```

## Apply Migrations

```bash
bun run db:migrate
```

## Roll Back

Use Coolify dashboard -> Deployments -> Rollback. Local fallback:

```bash
ROLLBACK_IMAGE_TAG=ghcr.io/onxos/onx-deploy:staging-previous bash scripts/rollback-staging.sh
```
