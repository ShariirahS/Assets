# DevOps & Deployment Guide

## Overview

The **Assets** project uses a **monorepo** architecture to manage both backend (Django) and frontend (Next.js) applications.  
This guide outlines the CI/CD workflows, environment configurations, Docker setup, and deployment strategies for production and staging environments.

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
├── docker-compose.yml       # Multi-service orchestration
├── .env.example             # Sample environment file
└── Makefile                 # Common build and test commands
```

---

## CI/CD Workflow

The project uses **GitHub Actions** for automated testing, linting, building, and deployment.

### Workflow Overview

1. **Pull Request Validation**
   - Lint backend and frontend code.
   - Run unit and integration tests.
2. **Build & Push Docker Images**
   - Tag and push images to a container registry.
3. **Deploy to Production**
   - Trigger remote deployment (Render, Railway, or Vercel).

**Example Workflow (`.github/workflows/deploy.yml`):**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.11
      - name: Install Dependencies
        run: pip install -r backend/requirements.txt
      - name: Run Tests
        run: pytest --maxfail=1 --disable-warnings -q
      - name: Build Docker Image
        run: docker build -t assets-backend ./backend
      - name: Push to DockerHub
        run: echo "${{ secrets.DOCKERHUB_TOKEN }}" | docker login -u ${{ secrets.DOCKERHUB_USER }} --password-stdin
      - run: docker push assets-backend
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Deployment
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Environment Configuration

All environment variables are centralized in `.env` files.

**Example `.env` file:**

```
# Backend
SECRET_KEY=supersecretkey
DATABASE_URL=postgresql://user:pass@db:5432/assets
ZARINPAL_MERCHANT_ID=your_merchant_id
ZARINPAL_CALLBACK_URL=https://api.assets.example.com/api/v1/payments/verify/
JWT_SECRET=jwtsecret
DEBUG=False

# Frontend
NEXT_PUBLIC_API_URL=https://api.assets.example.com
NEXT_PUBLIC_SITE_URL=https://assets.example.com

# Docker
POSTGRES_USER=assets_user
POSTGRES_PASSWORD=securepass
POSTGRES_DB=assets
```

---

## Docker Setup

Both backend and frontend are containerized for consistent environments.

**docker-compose.yml**

```yaml
version: "3.9"

services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    command: gunicorn assets_backend.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
    env_file:
      - .env
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    command: npm run start
    volumes:
      - ./frontend:/app
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

---

## Local Development

### Setup

```bash
git clone https://github.com/shari-ar/Assets.git
cd Assets
cp .env.example .env
docker-compose up --build
```

Backend available at → `http://localhost:8000`  
Frontend available at → `http://localhost:3000`

### Common Commands

```bash
make test         # Run tests
make format       # Lint and format code
make migrate      # Run Django migrations
make seed         # Load seed data
```

---

## Deployment Targets

| Environment               | Platform                    | Description                |
| ------------------------- | --------------------------- | -------------------------- |
| **Staging**               | Railway / Render            | Preview deployments for QA |
| **Production (Backend)**  | Render / Railway / AWS ECS  | Runs Django API            |
| **Production (Frontend)** | Vercel                      | Next.js SSR deployment     |
| **Database**              | Supabase / Railway Postgres | Managed PostgreSQL service |

---

## Monitoring & Logging

| Tool                              | Purpose                    |
| --------------------------------- | -------------------------- |
| **Sentry**                        | Application error tracking |
| **Prometheus**                    | Metrics collection         |
| **Grafana**                       | Visualization and alerting |
| **AWS CloudWatch / Railway Logs** | Infrastructure monitoring  |

**Example Log Configuration (`settings.py`):**

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
```

---

## Backup & Recovery

- Automated PostgreSQL backups using `pg_dump`.
- Daily snapshot retention policy for 30 days.
- Backups stored in S3 or Railway snapshots.
- Restore tested quarterly via CI scripts.

**Example Backup Script:**

```bash
pg_dump $DATABASE_URL > backup_$(date +%F).sql
```

---

## Security Considerations

- All services behind HTTPS with SSL termination.
- Use **Docker secrets** for credentials instead of plain `.env`.
- Enforce least privilege on database users.
- Enable **firewall rules** and **VPC isolation**.
- Use **fail2ban** or **UFW** for SSH protection.
- Auto-renew SSL certificates via **Let’s Encrypt**.

---

## Future Improvements

- Blue-green deployment strategy.
- Horizontal scaling via Kubernetes.
- Zero-downtime migrations.
- Canary deployments and rollback automation.
- Terraform for infrastructure as code (IaC).

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
