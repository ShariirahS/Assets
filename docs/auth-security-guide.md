# Auth & Security Guide

## Overview

This document outlines the **authentication, authorization, and security standards** implemented in the **Assets** platform.  
The system employs **OAuth 2.0**, **JWT-based session management**, and strong encryption practices (AES-256, SHA-256) to safeguard user data and operations.

---

## Authentication Flow

### 1. Login

- Users can authenticate using **email/password** or **OAuth 2.0 (SSO)** providers.
- Upon successful authentication, the server issues a **JWT access token** and a **refresh token**.
- Tokens are stored in **HttpOnly cookies** to prevent JavaScript access.

### 2. Token Refresh

- The frontend periodically refreshes tokens using the `/auth/refresh/` endpoint before expiration.
- Refresh tokens have a longer lifespan but can be revoked on logout or anomaly detection.

### 3. Logout

- Logout invalidates the refresh token on the server side and clears cookies in the client browser.

### 4. OAuth 2.0 / SSO

- The platform supports external identity providers such as **Google**, **GitHub**, and **Auth0**.
- The backend validates the external provider’s token and issues local JWTs for API access.
- OAuth flow: `Client → Provider Auth → Redirect → Token Exchange → JWT issued`.

---

## Authorization

| Role      | Permissions                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| **Admin** | Full access to manage users, tickets, reports, and wallets.                  |
| **User**  | Can create and manage personal tickets, view wallet and transaction history. |

- Authorization is enforced via **Django Ninja dependency injection** and **role-based decorators**.
- Sensitive endpoints (wallet updates, ticket actions) are double-checked with permission guards.

---

## Password Management

- User passwords are stored using **bcrypt** hashing.
- Password reset requests generate short-lived signed tokens with expiration limits.
- Login attempts are rate-limited by IP and user to prevent brute-force attacks.

---

## Encryption Standards

| Context              | Algorithm   | Usage                             |
| -------------------- | ----------- | --------------------------------- |
| **Data in Transit**  | TLS 1.3     | HTTPS between client and server   |
| **Data at Rest**     | AES-256-GCM | Encrypts wallet and personal data |
| **Password Hashing** | bcrypt      | Stores secure salted hashes       |
| **Integrity Check**  | SHA-256     | Verifies file and data integrity  |

- All sensitive keys and secrets are managed through environment variables.
- The backend supports **automatic key rotation** using versioned secrets.

---

## Session Security

- **HttpOnly** and **Secure** flags are set on cookies.
- CSRF protection is enforced for browser-based requests.
- CORS is limited to trusted frontend domains.
- Session timeouts and idle logout are configurable per role.

---

## Payment Security (Zarinpal)

- Zarinpal API keys are stored securely via environment variables.
- All payment callbacks are verified with Zarinpal’s checksum signature.
- Transactions use **HMAC-SHA256** signatures for request validation.
- Wallet operations are **atomic transactions** to prevent double-spend conditions.

---

## Audit Logging

Every sensitive operation is logged with:

- Timestamp and user ID
- Request IP and method
- Entity affected (ticket, wallet, user)
- Action outcome (success/failure)

Logs are immutable and periodically exported to an archival storage system.

---

## Security Testing

| Test Type               | Tools        | Description                                   |
| ----------------------- | ------------ | --------------------------------------------- |
| **Static Analysis**     | Bandit, Ruff | Scans Python code for vulnerabilities         |
| **Dependency Audit**    | Safety       | Checks for known CVEs in libraries            |
| **Penetration Testing** | OWASP ZAP    | Simulates common attacks (XSS, CSRF, SQLi)    |
| **Load Testing**        | Locust       | Evaluates performance under concurrent access |

---

## Compliance and Best Practices

- GDPR-aligned data handling and deletion workflows.
- Encryption keys and tokens never committed to version control.
- Security patches and dependencies updated via automated CI pipelines.
- Regular backup rotation and integrity checks.

---

## Incident Response

1. Detect → Monitor logs and alerts for anomalies.
2. Contain → Disable affected tokens, isolate endpoints.
3. Eradicate → Patch vulnerabilities and rotate secrets.
4. Recover → Restore service and notify stakeholders.
5. Review → Conduct post-mortem and update policies.

---

## References

- [Django Ninja Security Docs](https://django-ninja.rest-framework.com)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [JWT RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)
- [OWASP Top 10 2025](https://owasp.org/www-project-top-ten/)

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
