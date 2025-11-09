# 🏦 Assets — Open Source Asset Lending Platform

A simple, secure, and educational **peer-to-peer asset lending** platform where users lend and borrow assets through a ticket-based system with **time-limited access**.

---

## 🚀 Overview

**Assets** demonstrates a real-world full-stack architecture using **open-source tools only**.  
Users request to borrow assets, lenders approve the request, and both parties handle transactions through a built-in wallet — all wrapped in a modern, minimal UI.

| Feature | Description |
|----------|--------------|
| 🎫 Ticket System | Borrow/lend requests and approvals |
| 💰 Wallet | Internal user wallet with Zarinpal integration |
| 🔐 Auth | OAuth 2.0, JWT, Email/Password login |
| 👥 Roles | Admin & User access management |
| 🧮 Dashboards | User and admin panels with activity reports |
| ✉️ Notifications | SMS/WhatsApp + Email alerts |

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js, React, HeroUI |
| **Backend** | Django, Django Ninja |
| **Database** | PostgreSQL |
| **Security** | SSL, AES-256, SHA256, OAuth 2.0 |
| **Testing** | PyTest, Django Test Client |
| **Payments** | Zarinpal Gateway |
| **Infra** | Monorepo (TurboRepo), Seed Data, Docker-ready |

---

## 🧩 Architecture

Users → SSO/Auth → Next.js (HeroUI)
↓
Django API (Ninja)
↓
PostgreSQL (RLS)
↓
Zarinpal ↔ Wallet ↔ Tickets

---

## 🔑 Environment Setup

Create a `.env` file in the repo root based on the shared defaults:

```bash
cp .env.example .env
```

> 💡 **WSL tip:** make sure Docker Desktop integration is enabled for your WSL distro. Services started inside WSL are reachable from Windows via `http://localhost:<port>`, so no extra port forwarding is needed.

---

## ⚙️ Local Run

```bash
# 1️⃣ Clone the repo
git clone https://github.com/shari-ar/Assets.git
cd Assets

# 2️⃣ Run
docker compose up --build
```

---

## ⚠️ Current Dev Caveats

| Service | What you’ll see today | Workaround |
|---------|-----------------------|------------|
| Backend (Django) | `python manage.py runserver` is wired into Docker, but the project scaffold isn’t checked in yet, so the container exits with a missing `manage.py` error. | Keep the container stopped for now; once the Django app lands, restart with `docker compose up`. |
| Frontend (Next.js) | `npm run dev` now invokes Next.js, but the `next` dependency isn’t installed until the real app ships. | Wait to run the command until the frontend package.json gains the proper dependencies. |

> 💡 **WSL heads-up:** Docker Desktop still needs to stay running, and you’ll see the backend container crash fast for the reason above—that’s expected until the Django project is merged.

---

## 🫶 License

MIT License — free to use.
