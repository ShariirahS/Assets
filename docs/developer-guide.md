# Developer Guide

## Overview

Welcome to the **Assets Developer Guide** — a comprehensive manual for contributing to and maintaining the platform.  
This document outlines the development environment setup, coding standards, workflows, and best practices for backend and frontend developers.

The goal is to maintain a **consistent, secure, and scalable codebase** that serves as an educational example of modern full-stack software engineering.

---

## Prerequisites

| Requirement | Version  | Notes                            |
| ----------- | -------- | -------------------------------- |
| Python      | 3.11+    | Required for Django backend      |
| Node.js     | 18+      | Required for Next.js frontend    |
| PostgreSQL  | 15+      | Database engine                  |
| Docker      | Latest   | Containerized development        |
| Git         | 2.40+    | Version control                  |
| Redis       | Optional | For caching and background tasks |

---

## Repository Structure

```
Assets/
├── apps/
│   ├── backend/              # Django backend API (Django Ninja)
│   └── frontend/             # Next.js frontend with HeroUI
├── packages/
│   ├── shared/               # Shared TS utilities (types, constants)
│   └── config/               # Prettier, ESLint, Tailwind configs
├── docs/                     # Technical documentation
├── docker-compose.yml        # Multi-service orchestration
├── turbo.json                # Monorepo orchestration (Turborepo)
└── Makefile                  # Developer command shortcuts
```

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shari-ar/Assets.git
cd Assets
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

```bash
cp .env.example .env
```

### 3. Install Dependencies

**Backend:**

```bash
cd apps/backend
pip install -r requirements.txt
```

**Frontend:**

```bash
cd apps/frontend
npm install
```

---

## Running Locally

### Docker (Recommended)

```bash
docker-compose up --build
```

This launches:

- Django backend → `http://localhost:8000`
- Next.js frontend → `http://localhost:3000`
- PostgreSQL → `localhost:5432`

### Manual Execution

**Backend:**

```bash
python manage.py runserver
```

**Frontend:**

```bash
npm run dev
```

---

## Database Management

Apply migrations and seed sample data.

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata seed_data.json
```

Common database commands:
| Command | Description |
|----------|-------------|
| `python manage.py createsuperuser` | Create admin user |
| `python manage.py shell` | Run interactive shell |
| `python manage.py dumpdata` | Export data |
| `python manage.py flush` | Reset database |

---

## Branching & Workflow

The project uses **GitFlow** for structured collaboration.

| Branch      | Purpose                        |
| ----------- | ------------------------------ |
| `main`      | Production-ready code          |
| `develop`   | Integration branch for testing |
| `feature/*` | Active feature development     |
| `fix/*`     | Bugfix branches                |
| `docs/*`    | Documentation updates          |

### Example Workflow

```bash
git checkout develop
git checkout -b feature/ticket-system
# Implement feature
git commit -m "Add ticket request workflow"
git push origin feature/ticket-system
```

---

## Code Quality & Linting

| Area                  | Tool                             | Description                      |
| --------------------- | -------------------------------- | -------------------------------- |
| Python                | **Black**, **isort**, **flake8** | Formatting and style enforcement |
| JavaScript/TypeScript | **ESLint**, **Prettier**         | Code consistency                 |
| Commit Messages       | **Conventional Commits**         | Semantic commit messages         |

**Run all linters:**

```bash
make lint
```

**Format code automatically:**

```bash
make format
```

---

## Testing

### Backend Tests

```bash
pytest -v
```

### Frontend Tests

```bash
npm run test
```

Tests include:

- Unit tests (PyTest, Jest)
- Integration tests (Django Test Client)
- E2E tests (Playwright)

### Generate Coverage Report

```bash
pytest --cov=apps --cov-report=html
```

---

## API Development

Backend APIs are built with **Django Ninja**.

Example route:

```python
@router.get("/tickets/{id}", response=TicketSchema)
def get_ticket(request, id: int):
    return Ticket.objects.get(pk=id)
```

To view API docs, visit:  
👉 `http://localhost:8000/api/docs`

---

## Authentication System

Supported methods:

- Email & Password (JWT-based)
- OAuth 2.0 (Google, GitHub, Auth0)
- Admin & User roles

Authentication handled via **JWT tokens** (HttpOnly cookies) and OAuth integration.  
See [Auth & Security Guide](auth-security-guide.md) for detailed configuration.

---

## Frontend Development

Frontend uses **Next.js** (App Router) + **HeroUI** + **Tailwind CSS**.

### Development Commands

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run dev`   | Start local server      |
| `npm run build` | Create production build |
| `npm run lint`  | Check code quality      |
| `npm run test`  | Run tests               |

### Styling

Use Tailwind utilities for layout and HeroUI for components.

**Example:**

```tsx
<Button color="primary" className="rounded-2xl shadow-md">
  Submit
</Button>
```

---

## Monorepo Management

Managed via **Turborepo** for shared builds and caching.

Common commands:

```bash
npx turbo run dev
npx turbo run build
npx turbo run test
```

See [Monorepo Management Guide](monorepo-management.md) for more details.

---

## Common Issues

| Issue                     | Solution                                                 |
| ------------------------- | -------------------------------------------------------- |
| Docker build fails        | Run `docker system prune -a` and rebuild                 |
| Database connection error | Ensure PostgreSQL is running and `.env` vars are correct |
| Frontend API errors       | Verify `NEXT_PUBLIC_API_URL` in `.env`                   |
| Migration conflicts       | Rebuild migrations using `makemigrations --merge`        |

---

## Contributing

### Steps

1. Fork the repository.
2. Create a feature branch.
3. Make changes and add tests.
4. Open a pull request to `develop`.

### Commit Convention

```
feat: add new ticket approval endpoint
fix: correct wallet balance calculation
docs: update README for setup instructions
```

### Pull Request Checklist

- ✅ Code is linted and formatted.
- ✅ Tests are passing.
- ✅ Documentation updated.
- ✅ Branch merged cleanly with `develop`.

---

## Continuous Integration (CI)

Automated via **GitHub Actions**.

CI jobs include:

- Build & Test (backend + frontend)
- Linting
- Docker image build
- Deployment trigger (main branch)

See `.github/workflows/test.yml` for details.

---

## Deployment Workflow

- Backend → Render / Railway / Docker container
- Frontend → Vercel or Cloudflare Pages
- Database → PostgreSQL (Supabase or Railway)

Production builds generated via:

```bash
npm run build && python manage.py collectstatic
```

---

## Documentation & Style

- All documentation in `/docs` follows Markdown format.
- Each guide includes title, overview, sections, and maintainer details.
- Diagrams should be in `.svg` or `.png` format.

Use consistent language and structure similar to this file.

---

## Future Roadmap

- Add team collaboration and audit logging.
- Integrate continuous delivery (CD) pipelines.
- Expand notification channels (push, Telegram).
- Implement role-based API rate limiting.

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
