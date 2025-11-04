# API Reference

## Overview

This document provides the API reference for the **Assets** platform. All endpoints are implemented using **Django Ninja** and protected via **JWT authentication** with optional OAuth 2.0 integration.

Base URL:  
`https://api.assets.example.com/api/v1/`

---

## Authentication

### POST `/auth/login/`

Authenticate user with email and password, returning JWT tokens.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### POST `/auth/refresh/`

Refresh access token using a valid refresh token.

**Request:**

```json
{
  "refresh": "jwt_refresh_token"
}
```

**Response:**

```json
{
  "access": "new_jwt_access_token"
}
```

---

## Users

### GET `/users/me/`

Retrieve the authenticated user's profile.

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "wallet_balance": 250.0,
  "role": "user"
}
```

### PATCH `/users/me/`

Update user's profile details.

**Request:**

```json
{
  "first_name": "Shahriyar",
  "last_name": "A.R."
}
```

---

## Wallet

### GET `/wallet/`

Fetch wallet details and transaction history.

**Response:**

```json
{
  "wallet_id": "WAL123456",
  "balance": 250.0,
  "currency": "IRR",
  "transactions": [
    {
      "id": 1,
      "type": "credit",
      "amount": 100,
      "timestamp": "2025-11-01T14:32:00Z"
    },
    {
      "id": 2,
      "type": "debit",
      "amount": 50,
      "timestamp": "2025-11-02T09:10:00Z"
    }
  ]
}
```

### POST `/wallet/transfer/`

Transfer funds between users.

**Request:**

```json
{
  "recipient_id": 5,
  "amount": 20.0
}
```

**Response:**

```json
{
  "status": "success",
  "transaction_id": "TX998877"
}
```

---

## Tickets

### GET `/tickets/`

List all user-related tickets.

**Response:**

```json
[
  {
    "id": 12,
    "asset_name": "Canon EOS 5D",
    "status": "active",
    "price": 120,
    "lender": "alice@example.com",
    "borrower": "bob@example.com"
  }
]
```

### POST `/tickets/`

Create a new asset lending request.

**Request:**

```json
{
  "asset_name": "Laptop Dell XPS 13",
  "price": 150,
  "duration_days": 7
}
```

**Response:**

```json
{
  "id": 15,
  "status": "pending",
  "message": "Ticket created successfully."
}
```

---

### PATCH `/tickets/{ticket_id}/accept/`

Accept a lending request (admin or lender only).

**Response:**

```json
{
  "id": 15,
  "status": "accepted",
  "message": "Ticket accepted and payment initiated."
}
```

---

## Reports

### GET `/reports/overview/`

Get financial and activity reports for user or admin dashboards.

**Response:**

```json
{
  "total_users": 500,
  "total_tickets": 1200,
  "active_loans": 450,
  "total_volume": 35000000
}
```

---

## Errors

All endpoints return standardized error responses:

**Example:**

```json
{
  "detail": "Invalid token or session expired."
}
```

| HTTP Code | Meaning      |
| --------- | ------------ |
| 200       | Success      |
| 400       | Bad Request  |
| 401       | Unauthorized |
| 403       | Forbidden    |
| 404       | Not Found    |
| 500       | Server Error |

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
