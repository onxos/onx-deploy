# PLATFORM-PROD-01 Production Readiness Certificate

Authority: Founder / Program Director
Executor: GitHub Agent
Repository: onxos/onx-deploy
Date: 2026-06-30

## Certificate Result

PLATFORM PRODUCTION BLOCKED

## Passed Checks

- Compose config validation
- Database migration application
- Source runtime startup in production mode
- Health, readiness, DB health, metrics endpoint checks
- Smoke verification
- Logging access
- Monitoring hook exposure
- Recovery/runbook documentation presence

## Failed Checks

- Compose app startup through build path (`docker compose up --build`) due build worker SIGTERM

## Critical Production Blocker

- Containerized compose build/start path is not reliably completing in current verification environment.

## Minimal Fixes Included

- Configurable app image with build fallback in compose
- Build-time env propagation for auth/founder vars in Dockerfile/compose
- Readiness endpoint adjusted to use database as hard gate and memory as advisory signal
