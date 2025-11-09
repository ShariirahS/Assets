# DevOps & Deployment

## Overview

The **Assets** project uses a **monorepo** architecture to manage both backend (Django) and frontend (Next.js) applications. This guide outlines the CI/CD workflows, environment configurations, Docker setup, and deployment strategies for production and staging environments.

---

## Goals

- Streamline deployment through automation.
- Maintain consistency between development, staging, and production.
- Ensure scalability, observability, and fault tolerance.
- Simplify developer onboarding via Dockerized environments.

---

## Repository Structure

```
Assets/
├── backend/                 # Django + Django Ninja API
├── frontend/                # Next.js + HeroUI app
├── docs/                    # Documentation for contributors
├── .github/workflows/       # CI/CD pipelines
├── compose.yml              # Multi-service orchestration
├── .env.example             # Sample environment file
└── Makefile                 # Common build and test commands
```

---

## CI/CD Workflow

The project uses **GitHub Actions** for automated testing, linting, building, and deployment.

### Pipeline Blueprints

| Workflow            | Trigger                      | Jobs (in order)                                                                                 |
| ------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| **PR Quality Gate** | `pull_request` → `main`      | `setup` → `backend-lint` → `backend-test` → `frontend-lint` → `frontend-test` → `docker-build` |
| **Release Build**   | `push` → `main`              | `unit-test` → `docker-build` → `deploy-staging` → manual `deploy-prod`                         |
| **Nightly Health**  | `schedule` (02:00 UTC daily) | `db-backup` → `smoke-tests` → `sentry-report` _(echo placeholders until infrastructure is ready)_ |

### Job Details

1. **Setup**
   - Caches Python and Node dependencies once lockfiles exist.
   - Copies `.env.example` to `.env` so placeholder containers share consistent config.
2. **Linting & Tests**
   - Makefile targets currently echo placeholders while Django and Next.js apps are under construction.
   - Future commands (`ruff`, `pytest`, `npm run lint`, `npm test`) remain commented in workflows until real code lands.
3. **Docker Build**
   - Builds backend/frontend images that run `tail -f /dev/null` so services stay alive for integration.
   - Push commands stay commented until GHCR credentials and retention policies are finalized.
4. **Deployments**
   - Staging and production steps log intended `ssh docker compose up` invocations without executing them yet.
   - Manual approval for production remains enabled so the flow is ready once infrastructure is online.
5. **Nightly Checks**
   - Backup, smoke test, and Sentry jobs echo their target commands to avoid failures before endpoints exist.
   - The Sentry digest script prints JSON scaffolding; the webhook curl call is commented for future activation.

---

## Environment Configuration

All environment variables are centralized in the `.env` file.

| File/Secret          | Scope                        | Notes                                                     |
| -------------------- | ---------------------------- | --------------------------------------------------------- |
| `.env`               | Local development            | Copied from `.env.example`; never committed.              |
| `.env.ci`            | GitHub Actions               | Stored as encrypted secret and injected per workflow.     |
| `docker secrets`     | Staging/Production           | Mounted at runtime for database credentials & API tokens. |
| `vault:kv/assets/*`  | Optional (HashiCorp Vault)   | Central secret store when IaC is introduced.              |

---

## Docker Setup

Both backend and frontend are containerized for consistent environments.

| Service   | Dockerfile                      | Ports | Build Args                                  |
| --------- | ------------------------------- | ----- | ------------------------------------------- |
| Backend   | `backend/Dockerfile`            | 8000  | `PYTHON_VERSION`, `DJANGO_SETTINGS_MODULE`  |
| Frontend  | `frontend/Dockerfile` (future)  | 3000  | `NEXT_PUBLIC_API_URL`, `NODE_VERSION`       |
| Proxy     | `deploy/nginx/Dockerfile` (IaC) | 443   | `UPSTREAM_BACKEND`, `UPSTREAM_FRONTEND`     |

---

## Local Development

### Setup

```bash
git clone https://github.com/shari-ar/Assets.git
cd Assets
cp .env.example .env
docker compose up --build
```

Backend available at → `http://localhost:8000` (placeholder container)
Frontend available at → `http://localhost:3000` (placeholder container)

### Common Commands

```bash
make test         # Aggregates backend/frontend test placeholders
make format       # Runs placeholder lint targets
make migrate      # Prints intended Django migration command
make seed         # Prints intended seed fixture command
```

---

## Deployment Targets

| Environment    | Platform           | Description                |
| -------------- | ------------------ | -------------------------- |
| **Staging**    | Local Docker Setup | Preview deployments for QA |
| **Production** | VPS                | Available Online           |

### Rollout Strategy

1. Merge to `main` triggers automated staging deployment.
2. QA validation performed via `/healthz` and Cypress regression pack.
3. Manual approval in GitHub Actions promotes the same container images to production.
4. Post-deploy checks: `docker compose ps`, `curl https://assets.app/healthz`, Lighthouse run.
5. Rollback plan: redeploy previous SHA from GHCR tag history.

---

## Monitoring & Logging

| Tool           | Purpose                    |
| -------------- | -------------------------- |
| **Sentry**     | Application error tracking |
| **Prometheus** | Metrics collection         |
| **Grafana**    | Visualization and alerting |

---

## Backup & Recovery

- Automated PostgreSQL backups using `pg_dump`.
- Daily snapshot retention policy for 30 days.
- Restore tested quarterly via CI scripts.

**Example Backup Script:**

```bash
pg_dump $DATABASE_URL > backup_$(date +%F).sql
```

---

## Security Considerations

- Use **Nginx** for reverse proxy.
- Use **Docker secrets** for credentials instead of plain `.env`.
- Enforce least privilege on database users.
- Enable **firewall rules** and **VPC isolation**.
- Use **fail2ban** or **UFW** for SSH protection.
- Auto-renew SSL certificates via **Let’s Encrypt**.
- Rotate GitHub personal access tokens every 90 days and enforce SSO.
- Enable Dependabot security updates for Python, Node, and GitHub Actions.

---

## Infrastructure & Automation Roadmap

1. **Terraform Stack**
   - Manage VPS, networking, DNS, and SSL with state stored in Terraform Cloud.
   - Module layout: `infrastructure/network`, `infrastructure/compute`, `infrastructure/monitoring`.
2. **Configuration Management**
   - Use **Ansible** to provision Docker runtime, install monitoring agents, and manage cron jobs.
   - Inventory split between `staging` and `production` groups.
3. **Kubernetes Transition (Phase 2)**
   - Migrate compose stack to managed Kubernetes (e.g., DigitalOcean Kubernetes) for autoscaling.
   - Implement ArgoCD for GitOps continuous delivery.
4. **Advanced Release Strategies**
   - Introduce blue/green deployments with Traefik or Nginx canary routing.
   - Use database migration toggles (`django-lifelines`) to ensure zero downtime.

---

## Future Improvements

- Horizontal scaling via Kubernetes.
- Zero-downtime migrations.
- Canary deployments and rollback automation.
- Terraform for infrastructure as code (IaC).
