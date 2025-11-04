# Frontend Guide

## Overview

The **Assets** frontend is a modern, responsive, and component-driven web application built with **Next.js** and **HeroUI**.  
It serves as the user interface for managing authentication, asset lending, ticket tracking, wallets, and dashboards.

---

## Tech Stack

| Category         | Technology                       | Purpose                                   |
| ---------------- | -------------------------------- | ----------------------------------------- |
| Framework        | **Next.js 14 (React 18)**        | Server-side rendering (SSR) and routing   |
| UI Library       | **HeroUI**                       | Modern responsive UI components           |
| State Management | **Zustand** or **React Context** | Global state handling for auth and wallet |
| Styling          | **Tailwind CSS**                 | Utility-first CSS framework               |
| Forms            | **React Hook Form**              | Form handling and validation              |
| Charts           | **Recharts**                     | Data visualization for reports            |
| HTTP Client      | **Axios**                        | Communication with Django Ninja API       |
| Notifications    | **React Toastify**               | Feedback and alerts                       |
| Authentication   | **JWT** (via HttpOnly cookie)    | Secure session management                 |

---

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/                # Auth-related pages (login, register, reset password)
│   ├── (dashboard)/           # User and admin dashboards
│   ├── (tickets)/             # Ticket management pages
│   ├── (wallet)/              # Wallet and transaction views
│   ├── layout.tsx             # Global layout and header
│   └── page.tsx               # Default landing page
├── components/
│   ├── ui/                    # HeroUI component wrappers
│   ├── forms/                 # Custom reusable form components
│   ├── dashboard/             # Widgets and charts
│   └── shared/                # Common UI elements (Navbar, Footer, etc.)
├── hooks/
│   └── useAuth.ts             # Auth helper hook
├── lib/
│   ├── api.ts                 # Axios instance and interceptors
│   ├── auth.ts                # JWT utilities
│   └── config.ts              # Global constants
├── public/                    # Static assets
├── styles/                    # Global and Tailwind CSS
├── types/                     # TypeScript interfaces
└── package.json
```

---

## Routing & Pages

Next.js **App Router** (`/app` directory) handles routing.  
Each route corresponds to a logical module (e.g., `/wallet`, `/tickets`).  
Dynamic routes (e.g., `/tickets/[id]`) display detailed ticket info.

| Route            | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `/`              | Landing page with overview and login/register buttons |
| `/auth/login`    | User authentication page                              |
| `/auth/register` | Sign-up form (email/password)                         |
| `/dashboard`     | Personalized user dashboard                           |
| `/wallet`        | Wallet overview, transaction history, fund transfers  |
| `/tickets`       | List and manage user’s asset lending requests         |
| `/admin`         | Admin dashboard (for admins only)                     |

---

## API Integration

All data is fetched from the **Django Ninja API** using the configured Axios client.

**Example API Client (`lib/api.ts`):**

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Example Usage:**

```typescript
import api from "@/lib/api";

export async function fetchTickets() {
  const { data } = await api.get("/tickets/");
  return data;
}
```

---

## Authentication Flow

1. User logs in via `/auth/login` → backend issues **JWT** in an HttpOnly cookie.
2. Auth state is persisted client-side using a secure API call to `/users/me/`.
3. Protected routes are wrapped in a **`RequireAuth`** higher-order component (HOC).
4. Unauthorized users are redirected to `/auth/login` automatically.

---

## State Management

**Auth Context (Example):**

```typescript
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login/", { email, password });
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## UI Design Guidelines

- **Color Palette:** Neutral background, HeroUI primary theme, soft shadows, rounded corners.
- **Typography:** Inter or Poppins fonts for readability.
- **Layout:** Responsive grid with sidebar navigation for dashboards.
- **Accessibility:** Keyboard navigation and ARIA attributes where applicable.
- **Dark Mode:** Optional via Tailwind’s `dark:` class variants.

---

## Testing

| Type              | Tool              | Description                      |
| ----------------- | ----------------- | -------------------------------- |
| Unit Tests        | Jest              | Component-level tests            |
| Integration Tests | Playwright        | End-to-end testing of user flows |
| Linting           | ESLint + Prettier | Code quality enforcement         |

Run all tests:

```bash
npm run test
```

---

## Deployment

Frontend is deployed via **Vercel** (recommended) or Docker.

**Vercel Deployment Example:**

```bash
vercel --prod
```

**Environment Variables:**

```
NEXT_PUBLIC_API_URL=https://api.assets.example.com
NEXT_PUBLIC_ZARINPAL_SANDBOX=true
NEXT_PUBLIC_SITE_URL=https://assets.example.com
```

---

## Performance Optimization

- **Static Rendering (SSG)** for public pages.
- **Incremental Static Regeneration (ISR)** for dashboards.
- **Dynamic Imports** for heavy components.
- **Image Optimization** via Next.js `<Image />`.
- **Caching:** HTTP-level caching for API responses.

---

## Future Enhancements

- Offline support with Service Workers.
- Progressive Web App (PWA) mode.
- Advanced animations with Framer Motion.
- Localization (i18n) for multi-language support.
- Component theming using CSS variables.

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
