# ONX Staging Incident Response

## Severity

- P1: staging unavailable or login impossible
- P2: protected route or tRPC admin flow broken
- P3: documentation, metrics, or non-critical UI issue

## Response

1. Detect with `/api/health`, `/api/health/ready`, and container logs.
2. Confirm whether the issue is app, database, environment, or deployment.
3. Contain by rolling back to `onx-deploy:previous` if the new image is faulty.
4. Resolve with a patch or environment correction.
5. Verify with `bun run test:staging`.
6. Record the outcome in the staging checklist.

## Escalation

Staging P1 issues escalate to Husam immediately. Founder authorization is required only for production impact or production deployment decisions.
