#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
ROLLBACK_IMAGE_TAG="${ROLLBACK_IMAGE_TAG:-ghcr.io/onxos/onx-deploy:staging-previous}"
COMPOSE_ENV_ARGS=()
if [ -f ".env.staging" ]; then
  COMPOSE_ENV_ARGS=(--env-file .env.staging)
fi

docker tag "$ROLLBACK_IMAGE_TAG" ghcr.io/onxos/onx-deploy:staging-latest
docker compose "${COMPOSE_ENV_ARGS[@]}" -f "$COMPOSE_FILE" up -d
curl -fsS "http://localhost:${STAGING_PORT:-3000}/api/health" >/dev/null
echo "Rollback health check passed."
