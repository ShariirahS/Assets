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

Create `.env` file in the root folder (See `.env.template`).

---

## ⚙️ Local Run

```bash
# 1️⃣ Clone the repo
git clone https://github.com/shari-ar/Assets.git
cd Assets

# 2️⃣ Run
compose up --build
```

---

## 🫶 License

MIT License — free to use.
