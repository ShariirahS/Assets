# Backend

## Overview

The backend service is not implemented yet—the `backend` container simply echoes a placeholder message and idles. Use this document as a blueprint for what we intend to build once the Django project is generated.

!!! todo "Activate the backend runtime"
    Switch the Docker command from `bash -lc "echo 'Backend placeholder awaiting Django app'; tail -f /dev/null"` to `python manage.py runserver 0.0.0.0:8000` in both [`compose.yml`](../compose.yml) and [`backend/Dockerfile`](../backend/Dockerfile) after the project exists. The commented commands in those files are the source of truth.

Refer to the [architecture roadmap](./index.md#roadmap) for the sequence of tasks.

## Planned Tech Stack

| Category   | Planned technology           | Intended purpose                       |
| ---------- | ---------------------------- | -------------------------------------- |
| Framework  | **Django + Django Ninja**    | Core backend framework and API layer   |
| Database   | **PostgreSQL**               | Relational storage                     |
| Cache      | **Redis**                    | Caching, rate limiting, task signals   |
| Auth       | **JWT + OAuth 2.0**          | Session and SSO management             |
| Tasks      | **Celery (optional)**        | Background processing                  |
| Packaging  | **Gunicorn**                 | Production WSGI server                 |

## Repository Layout (Empty Shell)

```
backend/
├── Dockerfile          # Placeholder command only
├── pyproject.toml      # Dependency placeholder
└── (no Django project yet)
```

Creating the Django project (`django-admin startproject`) should be the first milestone.

## Apps to Implement

Once the project exists, create modular Django apps to match the product domains:

| App (planned)   | Responsibilities (planned)                                   |
| --------------- | ------------------------------------------------------------ |
| `auth`          | JWT issuance, OAuth provider integration, user lifecycle     |
| `wallet`        | Double-entry ledger, balance adjustments                     |
| `tickets`       | Loan request workflow, state transitions, SLA enforcement    |
| `payments`      | Gateway adapters (starting with Zarinpal)                    |
| `reports`       | Aggregations for dashboards and exports                      |
| `notifications` | SMS, WhatsApp, and email messaging                           |

## Development Checklist

Use this checklist while turning the placeholder into a working backend:

1. Scaffold the Django project in `backend/` and commit default settings.
2. Configure environment variables and database settings to match `POSTGRES_*` values in [`compose.yml`](../compose.yml).
3. Re-enable the commented `pip install` / `python manage.py migrate` lines in [`backend/Dockerfile`](../backend/Dockerfile).
4. Implement core apps (`auth`, `wallet`, `tickets`) with models and Ninja routers.
5. Introduce Celery workers when background jobs are required.
6. Swap the placeholder command for Gunicorn (`gunicorn config.wsgi:application --bind 0.0.0.0:8000`) for production-like runs.

## Testing Plan (Future)

Testing has not started yet. Plan to add:

- `pytest` or Django test runner for unit tests.
- API contract tests for Django Ninja endpoints.
- Integration tests executed against the Compose stack once services exist.

Keep the roadmap handy: [Architecture → Roadmap](./index.md#roadmap).
