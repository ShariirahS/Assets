# Monorepo Management Guide

## Overview

The **Assets** project follows a **monorepo architecture** powered by **Turborepo**.  
This structure enables the backend (Django) and frontend (Next.js) to share configurations, scripts, and CI/CD pipelines efficiently.  
A monorepo ensures consistent dependencies, unified tooling, and simplified cross-project collaboration.

---

## Goals

- Maintain **one repository** for both frontend and backend codebases.
- Facilitate **code sharing** (e.g., types, utilities).
- Streamline CI/CD and dependency management.
- Enable independent yet coordinated deployments.

---

## Monorepo Structure

```
Assets/
├── apps/
│   ├── backend/             # Django + Django Ninja API
│   └── frontend/            # Next.js + HeroUI client
│
├── packages/
│   ├── shared/              # Shared TypeScript utilities (models, constants)
│   └── config/              # ESLint, Prettier, Tailwind configs
│
├── docs/                    # Documentation for developers
├── turbo.json               # Turborepo configuration
├── package.json             # Root dependency management
├── docker-compose.yml       # Shared services orchestration
└── Makefile                 # Common commands
```

---

## Turborepo Overview

**Turborepo** provides incremental builds, caching, and parallel execution.  
It’s ideal for managing multi-app projects like **Assets** that contain both a backend and a frontend.

### Key Features

- **Pipeline caching:** Prevents redundant builds.
- **Task concurrency:** Runs independent tasks in parallel.
- **Remote caching:** Share build results across CI/CD environments.
- **Dependency graph awareness:** Runs only what changed.

---

## `turbo.json` Example

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "lint": {
      "outputs": []
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

---

## Managing Dependencies

### Root-Level Dependencies

All shared dependencies (like Prettier, ESLint, TypeScript) are installed at the root:

```bash
npm install -D eslint prettier typescript turbo
```

Each app or package can define its own dependencies in its respective `package.json`, but global tools live at the root.

**Example Root `package.json`:**

```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

---

## Development Workflow

### Start All Services

```bash
npm run dev
```

This command runs both **backend** (`Django`) and **frontend** (`Next.js`) concurrently using Turborepo pipelines.

### Start Backend Only

```bash
npm run dev --filter=backend
```

### Start Frontend Only

```bash
npm run dev --filter=frontend
```

### Run Tests

```bash
npm run test --filter=backend
npm run test --filter=frontend
```

### Lint & Format

```bash
npm run lint
npm run format
```

---

## Shared Utilities

### `packages/shared/`

This package holds cross-application utilities such as constants, TypeScript types, and helper functions.

**Example (`packages/shared/src/types.ts`):**

```typescript
export interface Ticket {
  id: number;
  asset_name: string;
  price: number;
  duration_days: number;
  status: "pending" | "accepted" | "active" | "completed";
}
```

The frontend can import these shared types directly:

```typescript
import { Ticket } from "@shared/types";
```

---

## Version Control

### Branching Strategy

| Branch      | Purpose                           |
| ----------- | --------------------------------- |
| `main`      | Production-ready code             |
| `develop`   | Integration branch for QA/staging |
| `feature/*` | Individual developer features     |
| `hotfix/*`  | Urgent patches on production      |

### Git Hooks

- **Pre-commit:** Lint and format code.
- **Pre-push:** Run tests.

Configured using **Husky**:

```bash
npx husky install
```

---

## Continuous Integration (CI)

CI pipelines use **GitHub Actions** and leverage Turborepo’s caching.  
Each workflow step runs only for changed packages.

**Example CI Workflow (`.github/workflows/ci.yml`):**

```yaml
name: Monorepo CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install Dependencies
        run: npm install
      - name: Build All Apps
        run: npx turbo run build
      - name: Run Tests
        run: npx turbo run test
```

---

## Docker Integration

Docker Compose coordinates backend, frontend, and PostgreSQL services together.

**Example:**

```bash
docker-compose up --build
```

Turborepo ensures Docker builds reuse cached artifacts, improving build times.

---

## Deployment Workflow

1. Backend and frontend images built in parallel.
2. Tagged by Git SHA or semantic version (`v1.0.0`).
3. Deployed independently to their target platforms:
   - **Backend:** Render / Railway / AWS ECS
   - **Frontend:** Vercel or Cloudflare Pages

Turborepo ensures consistent builds across both.

---

## Best Practices

- Keep **shared code** lightweight and stable.
- Prefer **semantic versioning** for internal packages.
- Avoid circular dependencies between apps/packages.
- Use **`.dockerignore`** and **`.gitignore`** to exclude unnecessary files.
- Regularly clean up Turborepo cache (`npx turbo prune`).

---

## Troubleshooting

| Issue                   | Solution                                   |
| ----------------------- | ------------------------------------------ |
| Build cache outdated    | Run `npx turbo clean`                      |
| Dependency mismatch     | Reinstall with `npm ci`                    |
| Build stuck on one app  | Run with `--filter` flag                   |
| Outdated shared package | Run `npx turbo run build --filter=@shared` |

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
