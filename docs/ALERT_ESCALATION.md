# ONX Staging Alert Escalation

## Alert Sources

- `/api/health`
- `/api/health/ready`
- container restart or crash loop
- staging smoke failure

## Staging Escalation

1. Health failure once: inspect logs.
2. Health failure three consecutive times: roll back or patch.
3. Login/auth failure: block staging promotion until fixed.
4. Production decision or production risk: escalate to Founder.

No production alerting contract is created by this document.
