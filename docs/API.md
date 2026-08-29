# API boundary

The conceptual public boundary is `/api/v1`. `PUBLIC_CONFIG` exposes its path to Angular; bundled configuration is public. There are no endpoints or secrets in Phase 1.

`HttpClient` uses fetch for SSR compatibility. A functional interceptor adds `X-Correlation-ID`, preserving a caller-provided value. `ApiError` contains safe code, status, message, optional correlation ID, field errors and retryability.

Future lead flow: validate server-side, persist transactionally, record an outbox job, respond, then notify through `EmailProvider`. Uploads, anti-spam, rate limiting and CSRF are deferred until backend and hosting selection.
