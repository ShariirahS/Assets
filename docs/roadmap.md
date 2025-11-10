# Project Roadmap

## Documented Capability Milestones

| Milestone                                                             | Documented Capabilities                                                                                                                     | Source                                                    |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Architecture Shell → Replace placeholder commands with real runtimes. | Monorepo layout, TurboRepo structure, Docker Compose placeholders awaiting Django/Next.js apps.                                             | [Architecture](./index.md)                                |
| Documented Auth Flows → Implement JWT + OAuth endpoints.              | Email/password & OAuth login, refresh/logout, secure cookies, audit logging, security testing suite.                                        | [Auth & Security](./auth-security.md)                     |
| Backend Blueprint → Scaffold Django project and domain apps.          | Planned Django + Ninja stack, app responsibilities (auth, wallet, tickets, payments, reports, notifications), enable migrations & Gunicorn. | [Backend](./backend.md)                                   |
| Frontend Blueprint → Scaffold Next.js App Router experience.          | Next.js + HeroUI stack, planned routes (`/dashboard`, `/wallet`, `/tickets`, `/admin`), Zustand state, build commands.                      | [Frontend](./frontend.md)                                 |
| Database Schema → Materialize core tables and constraints.            | Users, wallets, ledger entries, tickets, payments, reports, notifications tables with indexes and RLS guidance.                             | [Database Schema](./database-schema.md)                   |
| API Surface → Ship Ninja routers matching documented contracts.       | Auth, users, wallet, ticket, report endpoints with example payloads and error handling.                                                     | [API Reference](./api-reference.md)                       |
| Reporting Stack → Build dashboards & exports pipeline.                | Role-based dashboards, Redis caching, aggregation jobs, CSV/PDF exports, performance considerations.                                        | [Dashboards & Reporting](./dashboards-reporting.md)       |
| Payment Rails → Integrate Zarinpal adapter with ledger sync.          | Zarinpal endpoints, initiation/verification flows, sandbox creds, error codes, reconciliation steps, HMAC signatures.                       | [Payment Integration](./payment-integration.md)           |
| Messaging Fabric → Stand up Celery-powered notifications.             | Multi-channel templates (SMS, WhatsApp, Email), retry logic, logging, admin broadcast tools, Prometheus metrics.                            | [Notifications & Messaging](./notifications-messaging.md) |
| Role Enforcement → Enforce RBAC end-to-end.                           | Admin/User roles, permission matrix, decorators, dashboard access rules, future roles.                                                      | [User Roles & Permissions](./user-roles-permissions.md)   |
| Quality Gates → Automate testing strategy.                            | PyTest, Django Test Client, Jest/RTL, Playwright, Locust, Bandit/Safety workflows, fixtures and coverage guidance.                          | [Testing Guide](./testing.md)                             |
| Operational Platform → Turn DevOps scaffolding into CI/CD.            | GitHub Actions blueprints, Docker images, environment secrets, monitoring stack, Terraform/Ansible roadmap.                                 | [DevOps & Deployment](./devops-deployment.md)             |
| Platform Cohesion → Align services with system design guardrails.     | Cross-service flows (auth, wallets, tickets), integration topology, scalability tactics, security principles.                               | [System Design](./system-design.md)                       |

## Phase 1 — Core Runtime Bring-up

| Focus                       | Based On                                  | Next Step                                                                                       |
| --------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Activate Architecture Shell | Architecture, Backend, Frontend           | Generate Django + Next.js projects and switch Compose/Dockerfile commands to real runtimes.     |
| Stand up Auth & RBAC        | Auth & Security, User Roles & Permissions | Build `/auth/login`, `/auth/refresh`, role-aware middlewares, and audit logging.                |
| Materialize Database Schema | Database Schema                           | Create migrations for users, wallets, tickets, payments, notifications with documented indexes. |

## Phase 2 — Transaction & Data Foundations

| Focus                   | Based On                                 | Next Step                                                                                                |
| ----------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Deliver API Surface     | API Reference, System Design             | Implement Ninja routers for users, wallet, tickets, reports and align responses to documented contracts. |
| Wire Payment Rails      | Payment Integration, Database Schema     | Build Zarinpal initiation/verification, ledger reconciliation, and failure handling.                     |
| Enable Messaging Fabric | Notifications & Messaging, System Design | Launch Celery worker, channel adapters, and notification templates with retries.                         |

## Phase 3 — Experience & Insight

| Focus                      | Based On                                | Next Step                                                                                   |
| -------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Launch Frontend Experience | Frontend, API Reference                 | Implement documented routes, state management, and API client wrappers to render live data. |
| Build Reporting Stack      | Dashboards & Reporting, Database Schema | Implement aggregation jobs, Redis caching, and export endpoints powering dashboards.        |
| Establish Quality Gates    | Testing Guide, DevOps & Deployment      | Enable automated lint/test pipelines, Playwright suite, and CI enforcement.                 |

## Phase 4 — Operational Maturity

| Focus                         | Based On                              | Next Step                                                                                                        |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Harden Operations             | DevOps & Deployment                   | Turn placeholder GitHub Actions into deploy pipelines, configure monitoring stack, and document rollback drills. |
| Scale & Secure Platform       | System Design, Auth & Security        | Apply scalability patterns, enforce encryption practices, and finalize incident response workflows.              |
| Close Reporting Feedback Loop | Dashboards & Reporting, Testing Guide | Add observability metrics, regression alerts, and usage analytics to refine product decisions.                   |
