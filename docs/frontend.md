# Frontend

## Overview

The frontend service is also a stub—the `frontend` container only prints a placeholder message and waits. This page outlines the intended Next.js implementation once we scaffold the project.

!!! todo "Enable the Next.js runtime"
    Replace the placeholder command `bash -lc "echo 'Frontend placeholder awaiting Next.js app'; tail -f /dev/null"` with `npm run dev -- --hostname 0.0.0.0 --port 3000` in both [`compose.yml`](../compose.yml) and [`frontend/Dockerfile`](../frontend/Dockerfile) after the app exists. Production runs should eventually use `npm run start` as commented in those files.

Stay aligned with the [architecture roadmap](./index.md#roadmap) while building features.

## Planned Tech Stack

| Category         | Planned technology | Intended purpose                                 |
| ---------------- | ------------------ | ------------------------------------------------ |
| Framework        | **Next.js (App Router)** | Core UI framework + routing                 |
| UI Library       | **HeroUI**         | Component primitives                             |
| Styling          | **Tailwind CSS**   | Utility-first styling                            |
| Forms            | **React Hook Form**| Validation + UX                                   |
| State            | **Zustand / Context** | Session and wallet state management          |
| Charts           | **Recharts**       | Visualizations                                   |
| Notifications    | **React Toastify** | Feedback and toasts                              |

## Repository Layout (Empty Shell)

```
frontend/
├── Dockerfile          # Placeholder command only
├── package.json        # Placeholder dependency manifest
└── (no Next.js app yet)
```

Generate the Next.js project (`npx create-next-app`) before attempting to run the container.

## Pages to Build

Once the app exists, map business domains to routes:

| Route (planned)  | Goal (planned)                                  |
| ---------------- | ----------------------------------------------- |
| `/`              | Marketing/overview + entry point                |
| `/auth/login`    | User authentication                             |
| `/dashboard`     | Personalized metrics and shortcuts              |
| `/wallet`        | Balance overview and transfer initiation        |
| `/tickets`       | Loan request management                         |
| `/admin`         | Administrative back office                      |

## Development Checklist

1. Scaffold Next.js App Router project in `frontend/`.
2. Add `.env` variables expected by the placeholders (e.g., `NEXT_PUBLIC_API_URL`).
3. Re-enable `npm ci` and `npm run build` lines in [`frontend/Dockerfile`](../frontend/Dockerfile).
4. Implement API client wrappers pointing to the Django Ninja endpoints.
5. Build shared UI primitives and layout components.
6. Swap the placeholder command for `npm run dev` (local) or `npm run start` (production) and validate with the Compose stack.

## Testing Plan (Future)

Testing and linting will come online after the app exists:

- Component tests with Jest + React Testing Library.
- E2E flows with Playwright pointed at the Compose stack.
- ESLint/Prettier checks during CI.

Keep referencing the [roadmap](./index.md#roadmap) so frontend milestones align with backend progress.
