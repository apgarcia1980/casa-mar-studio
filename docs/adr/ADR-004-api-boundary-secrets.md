# ADR-004: API boundary and secrets

Status: accepted. Angular communicates only with typed public `/api/v1`. Anything bundled into Angular is public. Database, CMS, email, storage and signing credentials exist only server-side. Provider errors become safe normalized errors.
