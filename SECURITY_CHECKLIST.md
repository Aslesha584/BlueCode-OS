# BlueCode-OS — Production Security Checklist

This repository is a frontend-only prototype. Completing these items requires a backend and production deployment; the current demo is not production-secure authentication.

## Authentication and sessions
- Implement registration, login, logout, and password reset on the backend.
- Hash passwords with Argon2id or bcrypt; never store plaintext passwords.
- Use secure, HttpOnly, SameSite cookies or a reviewed session design; expire sessions and rotate credentials appropriately.
- Rate-limit authentication and recovery endpoints; consider MFA for privileged accounts.
- Never treat browser localStorage state as proof of identity or authorization.

## Tenant and data isolation
- Authenticate every protected API request.
- Check the signed-in user's ownership/workspace membership on every read, update, and delete.
- Scope all database queries to the authenticated owner/workspace; an ID alone is not authorization.
- Test cross-tenant access attempts and role/permission boundaries.

## Secrets and integrations
- Keep Apollo and AI provider credentials on the server only; never expose them in VITE_* variables or frontend bundles.
- Use customer-level Apollo OAuth, minimum scopes, backend token storage, rotation/revocation, and disconnect support.
- Redact credentials and unnecessary personal data from logs.
- Validate provider data and mark missing/unverified evidence honestly.

## Billing
- Use a payment provider's hosted checkout or tokenized components; do not collect or store raw card details in this app.
- Create checkout sessions on the backend and verify signed webhooks before activating a subscription.
- Make webhook handling idempotent; handle failed payments, renewals, cancellations and refunds.
- Enforce plan quotas server-side, not only by hiding UI controls.

## Web and operational security
- Use HTTPS, secure headers, input validation, safe database operations, CSRF protection where relevant, and XSS defenses.
- Keep dependencies updated; run dependency, secret, and vulnerability scans.
- Back up the database, test restoration, define data retention/deletion policies, and monitor security events.
- Add automated tests for authentication, ownership, quotas, provider failures, and payment webhooks.

## Current prototype limits
- Sign-in/create-account forms only simulate the flow; no real account is created.
- Workflow data is local demo data in browser storage; do not use real customer or prospect data.
- Apollo, AI, email, calendar and payments are not connected.
- The checkout is a visual preview only and must not be used to enter real card details.
