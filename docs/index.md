# Architecture

## Overview

The **Assets** project is still in the scaffolding phase. While the repository showcases how a Next.js + Django Ninja monorepo could look, every service is currently a placeholder container that prints status messages and idles. No business logic, database schema, or UI has been implemented yet.

## Monorepo Layout

The repository is organized as a monorepo using TurboRepo. Each folder at the root is a shell awaiting real code:

```
/ (root)
│  ├─ backend/   – Dockerfile + empty scaffold for a future Django project
│  ├─ frontend/  – Dockerfile + empty scaffold for a future Next.js app
│  ├─ docs/      – Project documentation (this site)
│  ├─ compose.yml – Docker Compose stack describing placeholder services
│  └─ …
```

Keeping both app surfaces in a single repository simplifies dependency management and release coordination once they exist.

## Current State

At the moment the Docker Compose stack spins up four containers:

| Service   | Reality today | Placeholder command |
| --------- | ------------- | ------------------- |
| `backend` | No Django app yet. | `bash -lc "echo 'Backend placeholder awaiting Django app'; tail -f /dev/null"` (see [`compose.yml`](../compose.yml)). |
| `frontend`| No Next.js app yet. | `bash -lc "echo 'Frontend placeholder awaiting Next.js app'; tail -f /dev/null"` (see [`compose.yml`](../compose.yml)). |
| `db`      | Ready-to-run Postgres image. | Standard `postgres:16` entrypoint. |
| `redis`   | Ready-to-run Redis image. | Standard `redis:7-alpine` entrypoint. |

Both app containers mirror the placeholder commands in their Dockerfiles, keeping the stack idle until code exists.

!!! todo "Follow the real build path"
    Replace the backend command with `python manage.py runserver 0.0.0.0:8000` (or Gunicorn) after creating the Django project. Likewise, swap the frontend command for `npm run dev -- --hostname 0.0.0.0 --port 3000` once the Next.js app is scaffolded. These commands are already commented in [`compose.yml`](../compose.yml), [`backend/Dockerfile`](../backend/Dockerfile), and [`frontend/Dockerfile`](../frontend/Dockerfile).

## Backend Architecture (Planned)

The `backend/` directory only contains Docker boilerplate today. Once the Django project is generated, expect apps such as authentication, wallet, tickets, reports, payments, and notifications to live under `backend/apps/`. See the [roadmap](#roadmap) for the build order.

## Database Schema (Planned)

The schema described below will be modelled once Django migrations are introduced; no tables exist yet.

| Table (planned)   | Purpose (planned)                                  |
| ----------------- | -------------------------------------------------- |
| `users`           | Account + role management.                         |
| `wallets`         | Wallet balances and currency metadata.             |
| `ledger_entries`  | Double-entry transaction history.                  |
| `tickets`         | Asset lending lifecycle records.                   |
| `ticket_comments` | Collaboration between borrower and lender.         |
| `audit_logs`      | Critical action auditing.                          |

## Request Lifecycle (Concept)

The future flow will roughly follow the steps below once APIs exist. Keep this as a reference checklist while building.

1. User authenticates and receives JWTs.
2. Frontend posts ticket data to REST endpoints.
3. Backend persists data, notifies stakeholders, and orchestrates payments.
4. Wallet service performs double-entry bookkeeping.
5. Reports aggregate data for dashboards and exports.

## Security Considerations (Planned)

Security work will start after core features land. Use this list as guidance for future stories.

- OAuth 2.0, JWT, and role checks for access control.
- HTTPS termination with Nginx proxy templates under `deploy/nginx`.
- Rate limiting and audit logging for critical actions.

## Extensibility & Deployment (Coming Soon)

No CI/CD or deployment pipelines are active yet. The Dockerfiles document the intended commands and should be updated once real builds exist.

!!! todo "Wire up build + serve commands"
    - Update [`backend/Dockerfile`](../backend/Dockerfile) to run `python manage.py migrate` and start Gunicorn when the Django app is ready.
    - Update [`frontend/Dockerfile`](../frontend/Dockerfile) to install dependencies with `npm ci`, build with `npm run build`, and start with `npm run start`.

## Roadmap

Follow these steps to turn the placeholders into a working platform:

1. **Bootstrap Django project** in `backend/` (e.g., `django-admin startproject config .`). Update `compose.yml` to replace the placeholder command with `python manage.py runserver 0.0.0.0:8000`.
2. **Create initial apps** (`auth`, `wallet`, `tickets`) and migrations. Re-enable the commented `python manage.py migrate` in the backend Dockerfile.
3. **Scaffold Next.js app** in `frontend/`. Swap the compose command to `npm run dev -- --hostname 0.0.0.0 --port 3000`.
4. **Implement API routes** with Django Ninja and connect the frontend pages.
5. **Add production commands**: enable Gunicorn in `compose.yml` and `backend/Dockerfile`, and turn on `npm run start` in `frontend/Dockerfile`.
6. **Harden deployment**: configure Nginx templates under `deploy/nginx`, set secrets, and add CI checks.

Each step unlocks the next; [`compose.yml`](../compose.yml) remains the source of truth for the service commands.
