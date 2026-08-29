# ADR-006: Durable leads and notifications

Status: accepted; implementation deferred. Persist leads independently, then dispatch notification through an outbox/queue and replaceable `EmailProvider`. Provider outages must not lose leads; later CRM automation must not change Angular.
