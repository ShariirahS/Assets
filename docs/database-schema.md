# Database Schema Documentation

## Overview

This document defines the **database schema** for the **Assets** platform.  
It outlines all major tables, relationships, constraints, and indexing strategies.  
The platform uses **PostgreSQL** as the relational database engine, ensuring ACID compliance, foreign key integrity, and high scalability.

---

## Core Design Principles

- **Normalization:** Third Normal Form (3NF) to reduce redundancy.
- **Auditability:** All wallet and ticket operations are logged.
- **Security:** Role-based access and optional Row-Level Security (RLS).
- **Extensibility:** Modular tables to support new features such as asset categories or payment gateways.
- **Integrity:** Foreign keys, constraints, and cascade rules ensure consistent data.

---

## Entity Relationship Diagram (ERD)

```
┌────────────┐     ┌──────────────┐      ┌───────────────┐
│   users    │──┐  │   tickets    │──┐   │   payments    │
└────────────┘  │  └──────────────┘  │   └───────────────┘
      │         │        │           │          │
      ▼         ▼        ▼           ▼          ▼
┌────────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────┐
│  wallets   │  │ ledger_entry │  │  reports   │  │ notifications│
└────────────┘  └──────────────┘  └────────────┘  └──────────────┘
```

---

## Table Definitions

### 1. `users`

Stores registered user accounts and identity provider metadata.

| Column         | Type                 | Constraints      | Description                            |
| -------------- | -------------------- | ---------------- | -------------------------------------- |
| `id`           | SERIAL               | PK               | Unique user ID                         |
| `email`        | VARCHAR(255)         | UNIQUE, NOT NULL | Primary user identifier                |
| `password`     | VARCHAR(255)         | NULLABLE         | Encrypted password (for non-SSO users) |
| `first_name`   | VARCHAR(100)         |                  | User’s first name                      |
| `last_name`    | VARCHAR(100)         |                  | User’s last name                       |
| `role`         | ENUM('admin','user') | DEFAULT 'user'   | Role-based permissions                 |
| `sso_provider` | VARCHAR(50)          |                  | OAuth2 provider name                   |
| `sso_sub`      | VARCHAR(255)         |                  | External provider subject ID           |
| `created_at`   | TIMESTAMP            | DEFAULT now()    | Creation timestamp                     |
| `updated_at`   | TIMESTAMP            | DEFAULT now()    | Last profile update                    |

**Indexes:**

- `idx_users_email` for quick lookups.
- Unique composite index on `(sso_provider, sso_sub)` for federated users.

---

### 2. `wallets`

Each user owns one wallet, holding their balance in IRR (Rials).

| Column       | Type                    | Constraints      | Description        |
| ------------ | ----------------------- | ---------------- | ------------------ |
| `id`         | SERIAL                  | PK               | Wallet ID          |
| `user_id`    | INT                     | FK → users.id    | Wallet owner       |
| `balance`    | NUMERIC(18,2)           | DEFAULT 0        | Current balance    |
| `currency`   | VARCHAR(10)             | DEFAULT 'IRR'    | Currency code      |
| `status`     | ENUM('active','frozen') | DEFAULT 'active' | Wallet state       |
| `created_at` | TIMESTAMP               | DEFAULT now()    | Creation timestamp |

**Constraints:**

- One wallet per user (UNIQUE `user_id`).

**Indexes:**

- `idx_wallets_user` for fast joins.

---

### 3. `ledger_entries`

Records every financial transaction for audit purposes (double-entry system).

| Column        | Type                   | Constraints        | Description                          |
| ------------- | ---------------------- | ------------------ | ------------------------------------ |
| `id`          | SERIAL                 | PK                 | Ledger record ID                     |
| `wallet_id`   | INT                    | FK → wallets.id    | Related wallet                       |
| `type`        | ENUM('credit','debit') |                    | Transaction direction                |
| `amount`      | NUMERIC(18,2)          | CHECK (amount > 0) | Transaction amount                   |
| `ref`         | VARCHAR(64)            |                    | External reference (Zarinpal Ref ID) |
| `description` | TEXT                   |                    | Human-readable info                  |
| `created_at`  | TIMESTAMP              | DEFAULT now()      | Time of entry                        |
| `created_by`  | INT                    | FK → users.id      | Who triggered it                     |

**Indexes:**

- `idx_ledger_wallet` on `wallet_id`.
- `idx_ledger_ref` for reconciliation with payment gateway.

---

### 4. `tickets`

Handles asset lending requests and agreements.

| Column          | Type                                                        | Constraints       | Description               |
| --------------- | ----------------------------------------------------------- | ----------------- | ------------------------- |
| `id`            | SERIAL                                                      | PK                | Ticket ID                 |
| `asset_name`    | VARCHAR(255)                                                | NOT NULL          | Asset name or description |
| `borrower_id`   | INT                                                         | FK → users.id     | Borrower user             |
| `lender_id`     | INT                                                         | FK → users.id     | Lender user               |
| `price`         | NUMERIC(18,2)                                               |                   | Agreed rental price       |
| `duration_days` | INT                                                         |                   | Duration of lending       |
| `status`        | ENUM('pending','accepted','active','completed','cancelled') | DEFAULT 'pending' | Ticket state              |
| `created_at`    | TIMESTAMP                                                   | DEFAULT now()     | Creation timestamp        |
| `updated_at`    | TIMESTAMP                                                   | DEFAULT now()     | Status change timestamp   |

**Indexes:**

- `idx_tickets_borrower_lender`
- `idx_tickets_status` for admin dashboards.

---

### 5. `payments`

Tracks transactions made through Zarinpal.

| Column        | Type                                  | Constraints         | Description              |
| ------------- | ------------------------------------- | ------------------- | ------------------------ |
| `id`          | SERIAL                                | PK                  | Payment record ID        |
| `ticket_id`   | INT                                   | FK → tickets.id     | Related ticket           |
| `authority`   | VARCHAR(64)                           | UNIQUE              | Zarinpal authority token |
| `ref_id`      | BIGINT                                |                     | Zarinpal reference ID    |
| `amount`      | NUMERIC(18,2)                         |                     | Payment amount           |
| `status`      | ENUM('initiated','verified','failed') | DEFAULT 'initiated' | Payment state            |
| `created_at`  | TIMESTAMP                             | DEFAULT now()       | Payment start time       |
| `verified_at` | TIMESTAMP                             |                     | Verification timestamp   |

**Indexes:**

- `idx_payments_authority` and `idx_payments_ref`.

---

### 6. `reports`

Stores aggregated data for dashboards and analytics.

| Column          | Type          | Description         |
| --------------- | ------------- | ------------------- |
| `id`            | SERIAL        | PK                  |
| `report_date`   | DATE          | Date of aggregation |
| `total_users`   | INT           |                     |
| `total_tickets` | INT           |                     |
| `active_loans`  | INT           |                     |
| `total_volume`  | NUMERIC(18,2) |                     |

**Indexes:**

- `idx_reports_date` for quick historical queries.

---

### 7. `notifications`

Tracks messages sent via SMS, WhatsApp, or email.

| Column       | Type                           | Description      |
| ------------ | ------------------------------ | ---------------- | --- |
| `id`         | SERIAL                         | PK               |
| `user_id`    | INT                            | FK → users.id    |
| `channel`    | ENUM('sms','whatsapp','email') |                  |
| `message`    | TEXT                           |                  |
| `status`     | ENUM('queued','sent','failed') | DEFAULT 'queued' |     |
| `created_at` | TIMESTAMP                      | DEFAULT now()    |     |

---

## Relationships Summary

| Relationship                 | Type        | Description                           |
| ---------------------------- | ----------- | ------------------------------------- |
| `users` → `wallets`          | One-to-One  | Each user has one wallet              |
| `users` → `tickets`          | One-to-Many | Users can create multiple tickets     |
| `wallets` → `ledger_entries` | One-to-Many | Each wallet has multiple transactions |
| `tickets` → `payments`       | One-to-One  | Each ticket has one payment record    |
| `users` → `notifications`    | One-to-Many | Users receive multiple notifications  |

---

## Database Management Notes

- Migrations handled via **Django ORM** and `manage.py migrate`.
- Backup and restore via `pg_dump` and `pg_restore`.
- Schema versioning via Django migration history.
- Foreign key constraints use `ON DELETE CASCADE` for dependent records.
- Regular vacuum and analyze scheduled for performance optimization.

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
