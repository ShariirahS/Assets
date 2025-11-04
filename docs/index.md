# Architecture Guide

## Overview

The **Assets** project is a full‑stack, peer‑to‑peer asset lending platform built with a modern open‑source stack.  It demonstrates how to combine **Next.js** with **Django Ninja** in a **monorepo** powered by **TurboRepo**.  Users borrow and lend assets through ticket‑based requests, track balances via an integrated wallet, and handle payments using the Zarinpal gateway.

## Monorepo Layout

The repository is organized as a monorepo using TurboRepo.  Each folder at the root serves a distinct purpose:

```
/ (root)
│  ├─ backend/   – Django project using Django Ninja for the API
│  ├─ frontend/  – Next.js app using React and HeroUI for the UI
│  ├─ packages/  – shared code (types, helpers)
│  ├─ docs/      – project documentation
│  ├─ mkdocs.yml – MkDocs configuration for documentation site
│  └─ …
```

Having the server and client in one repository simplifies dependency management, encourages code sharing, and makes it easier to coordinate releases.

## Application Flow

The following diagram illustrates the high‑level flow of a typical session:

```
                ┌───────────────┐        ┌──────────────┐       ┌───────────────┐
    User ──────▶ │  Frontend │ ───────▶ │  Backend   │ ───────▶│ Database  │
                │ (Next.js) │        │ (Django)   │       │ (Postgres)│
                └───────────────┘        └──────────────┘       └───────────────┘
                     ▲                     │                    │
                     │                     │                    │
                     │                     ▼                    │
                OAuth 2.0 / JWT       Business logic       Persistent data
```

1. **Authentication:** Users log in using Auth0 (SSO) or email/password via OAuth 2.0.  Upon successful authentication, the frontend stores a short‑lived JWT in a secure cookie.
2. **Frontend:** Built with Next.js and HeroUI, it provides dashboards, forms for ticket creation, and wallet management.  It communicates with the backend via REST endpoints.
3. **Backend:** Django + Django Ninja expose a versioned API.  Services include authentication, wallet operations, ticket lifecycle management, and reporting.
4. **Database:** PostgreSQL stores users, roles, wallets, ledger entries, tickets, and audit logs.  Row‑level security can be enabled for multi‑tenant scenarios.
5. **Payments:** The backend integrates with Zarinpal for payment processing; future gateways can be added via an adapter pattern.

## Backend Architecture

The **backend** folder contains a Django project configured with Django Ninja.  Each module is structured as an app:

- **auth** – handles OAuth 2.0, email/password login, JWT issuance, and role management.
- **wallet** – manages user balances and ledger entries; interacts with payment providers.
- **tickets** – CRUD operations for loan requests and approvals; manages ticket statuses and SLA logic.
- **reports** – aggregates data for dashboards and exports (CSV, XLSX).

The API is type‑hinted and auto‑documented via OpenAPI/Swagger, making it easy for developers to explore available endpoints.

## Database Schema (Key Tables)

| Table              | Description                                      |
|--------------------|--------------------------------------------------|
| `users`            | User accounts, including SSO subject and role.   |
| `wallets`          | One wallet per user; tracks balance and currency.|
| `ledger_entries`   | Double‑entry accounting for wallet transactions.  |
| `tickets`          | Asset lending requests with status and pricing.   |
| `ticket_comments`  | Comments and attachments associated with tickets.|
| `audit_logs`       | Records of security‑sensitive actions.            |

This schema is defined in Django models and managed via migrations.  Seed data is provided to facilitate local development and testing.

## Request Lifecycle Example

To illustrate how components work together, consider the flow of creating a ticket:

1. **Login:** The user logs in via Auth0 (or email/password), receiving a JWT.
2. **Create Ticket:** On the frontend, the user fills out a form specifying the asset, desired duration, and price.  The form posts to `POST /tickets/`.
3. **Backend Processing:** Django Ninja validates the request, creates a `Ticket` record in Postgres, and emits a notification to the lender via SMS/WhatsApp and email.
4. **Lender Response:** The lender accepts or declines via a PATCH endpoint; if accepted, the platform records a pending transaction.
5. **Payment & Ledger:** Once both parties confirm, the wallet service debits the borrower’s balance and credits the lender’s.  Ledger entries are written, and Zarinpal processes the external payment.
6. **Completion:** At the end of the loan period, the ticket status is updated and funds are settled accordingly.

## Security Considerations

- **Authentication & Authorization:** OAuth 2.0 and JWT ensure that only authenticated users can access protected routes.  Role checks enforce permissions (admin vs user).
- **Transport & Data Security:** All traffic is served over HTTPS; sensitive data at rest is encrypted (e.g. AES for private keys).  Passwords are hashed with modern algorithms like bcrypt.
- **Rate Limiting:** The API includes rate limiting and CSRF protection to mitigate abuse.
- **Audit Logging:** Administrative actions and wallet operations are logged for traceability.

## Extensibility & Deployment

The project is intentionally modular:

- **Adapters:** Payment providers are abstracted behind interfaces; adding support for other gateways (Stripe, Coinbase) requires minimal changes.
- **Services:** Each domain (auth, wallet, tickets) can be extended independently, making it easy to introduce new features such as asset categories or escrow.
- **DevOps:** The repository includes Docker and CI/CD configurations (GitHub Actions).  Deployments can target platforms like Vercel (frontend) and Render/Railway/Fly (backend).

By following this structure, developers can learn how to build a robust, secure web application, and adapt it for their own projects.
