#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="${IMAGE_TAG:-ghcr.io/onxos/onx-deploy:staging-latest}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
COMPOSE_ENV_ARGS=()
if [ -f ".env.staging" ]; then
  COMPOSE_ENV_ARGS=(--env-file .env.staging)
fi

bun install --frozen-lockfile
bun run lint
bun run test
bun run build
docker build -t "$IMAGE_TAG" .
docker compose "${COMPOSE_ENV_ARGS[@]}" -f "$COMPOSE_FILE" up -d

echo "Waiting for staging health..."
for _ in {1..30}; do
  if curl -fsS "http://localhost:${STAGING_PORT:-3000}/api/health" >/dev/null; then
    echo "Staging deploy healthy."
    exit 0
  fi
  sleep 2
done

echo "Staging health did not become ready." >&2
exit 1
