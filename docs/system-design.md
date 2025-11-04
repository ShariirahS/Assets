# System Design Specification

## 1. Purpose

This document defines the **system-level design** for the _Assets_ platform — a peer-to-peer asset lending system.  
It describes the overall architecture, functional modules, interactions, and scalability considerations to guide developers, contributors, and learners.

---

## 2. Goals and Principles

- **Educational clarity:** Simple, transparent, and open-source architecture suitable for learning.
- **Security first:** Encrypted data flows, strict role boundaries, and auditable transactions.
- **Extensibility:** Modular services and replaceable adapters for payments, storage, and notifications.
- **Performance:** Efficient API responses and database queries under concurrent load.
- **Reliability:** Atomic transactions and safe wallet ledger operations.

---

## 3. High-Level Overview

The system consists of five major components:

| Component         | Description                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Frontend**      | Next.js + HeroUI web client for users and admins. Handles authentication, dashboards, and wallet/ticket interactions. |
| **API Gateway**   | Django Ninja REST API providing all endpoints; handles auth, validation, and service routing.                         |
| **Core Services** | Logical modules: `auth`, `wallet`, `tickets`, `reports`. Each has its own models, serializers, and business logic.    |
| **Database**      | PostgreSQL with normalized schema and foreign keys. Enables strong consistency and auditability.                      |
| **Integrations**  | Zarinpal for payments, SMS/WhatsApp for notifications, optional email services (Postmark/SendGrid).                   |

---

## 4. Functional Flow

### 4.1 Authentication and Access

1. User logs in via **OAuth 2.0** (SSO) or email/password.
2. Backend issues a **JWT** stored in an `HttpOnly` cookie.
3. Frontend attaches the token to future requests.
4. Role-based middleware enforces access (admin vs user).

### 4.2 Lending Workflow

1. **Borrower** submits a ticket specifying asset, duration, and price.
2. **Lender** receives a notification and accepts or declines.
3. Once accepted, funds are reserved in borrower’s wallet.
4. Payment captured through **Zarinpal** and ledger entries created.
5. Ticket status transitions: _pending → accepted → active → completed_.
6. Post-loan, funds are settled and transaction logs updated.

### 4.3 Wallet and Payments

- Each user has one wallet in PostgreSQL.
- **Double-entry ledger** ensures all debits and credits are balanced.
- External payments handled by **Zarinpal adapter**, abstracted for future providers.
- Audit trail captures all wallet operations.

---

## 5. Data Flow Diagram

+-----------+ +--------------+ +--------------+ +-------------+
| Browser | <----> | API Gateway | <----> | Core Services | <----> | PostgreSQL |
| (Next.js) | | (Django) | | (Auth,Wallet, | | (RLS, Logs) |
| | | | | Tickets...) | | |
+-----------+ +--------------+ +--------------+ +-------------+
| | | |
+--> Zarinpal, SMS, Email Integrations <------+

---

## 6. Scalability and Deployment

| Area                | Approach                                                               |
| ------------------- | ---------------------------------------------------------------------- |
| **Monorepo**        | TurboRepo for shared code and consistent tooling.                      |
| **API Scaling**     | Horizontal scaling behind load balancer; stateless JWT authentication. |
| **DB Optimization** | Indexing, query caching, and read replicas if necessary.               |
| **Caching**         | Redis for sessions, rate-limiting, and transient data.                 |
| **Static Assets**   | Deployed via Vercel CDN for the frontend.                              |

---

## 7. Security and Compliance

- **Transport security:** SSL/TLS enforced across all endpoints.
- **Data at rest:** AES-256 encryption for sensitive fields.
- **Hashing:** SHA-256 for integrity; bcrypt for passwords.
- **Audit logging:** Immutable logs for all wallet and admin actions.
- **Compliance readiness:** GDPR and data deletion policies.

---

## 8. Testing Strategy

| Layer        | Tool                       | Coverage                                   |
| ------------ | -------------------------- | ------------------------------------------ |
| **Backend**  | PyTest, Django Test Client | Unit + integration tests for all endpoints |
| **Frontend** | Playwright                 | UI workflows and regression checks         |
| **CI/CD**    | GitHub Actions             | Lint, test, migrate, and deploy pipelines  |

---

## 9. Future Enhancements

- Multi-tenant organizations and team lending.
- Asset categories with images and metadata.
- Smart matching between lenders and borrowers.
- Reporting dashboards with time-series analytics.
- Optional blockchain-based escrow layer.

---

## 10. References

- `architecture.md` — overall structure and data models
- Django Ninja API schema (`/api/docs`)
- Zarinpal Payment Integration docs
- Next.js and HeroUI component library

---

**Maintainer:** [Shahriyar](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
