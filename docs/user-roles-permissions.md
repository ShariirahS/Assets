# User Roles & Permissions Guide

## Overview

The **Assets** platform implements a robust **role-based access control (RBAC)** system to ensure that users have access only to authorized functionality.  
This guide explains the available roles, permission hierarchies, and enforcement mechanisms within the backend and frontend applications.

---

## Goals

- Protect sensitive operations from unauthorized access.
- Simplify permission management for users and admins.
- Support future scalability (e.g., team-based or organization-based roles).
- Enforce the principle of least privilege.

---

## Core Roles

| Role      | Description                                  | Typical Actions                                                  |
| --------- | -------------------------------------------- | ---------------------------------------------------------------- |
| **Admin** | Platform administrator with full privileges. | Manage users, approve tickets, generate reports, modify wallets. |
| **User**  | Standard authenticated user.                 | Create and manage their own tickets, use wallet, view reports.   |

---

## Role Hierarchy

```
Admin
 └── User
```

- **Admins** have complete access to all resources.
- **Users** have access only to their own data and limited public endpoints.
- Future roles (e.g., `moderator`, `auditor`) can extend this hierarchy.

---

## Permission Matrix

| Module              | Action                   | User | Admin |
| ------------------- | ------------------------ | ---- | ----- |
| **Authentication**  | Register/Login           | ✅   | ✅    |
| **Tickets**         | Create/Update/Delete Own | ✅   | ✅    |
| **Tickets**         | Approve/Reject Any       | ❌   | ✅    |
| **Wallet**          | View/Manage Own          | ✅   | ✅    |
| **Wallet**          | Adjust Others’ Wallets   | ❌   | ✅    |
| **Reports**         | View Personal Reports    | ✅   | ✅    |
| **Reports**         | Access All Reports       | ❌   | ✅    |
| **Notifications**   | Receive                  | ✅   | ✅    |
| **Notifications**   | Broadcast                | ❌   | ✅    |
| **Admin Dashboard** | Access                   | ❌   | ✅    |

✅ = Allowed | ❌ = Restricted

---

## Database Model

**Model: `User` (Django ORM)**

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("user", "User"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="user")

    def is_admin(self):
        return self.role == "admin"

    def is_user(self):
        return self.role == "user"
```

---

## Middleware & Permission Enforcement

All API endpoints use Django Ninja’s dependency injection for authentication and role-based filtering.

**Example:**

```python
from ninja.security import HttpBearer

class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        # Validate token and return user
        user = decode_jwt(token)
        return user

def admin_required(user):
    if not user or user.role != "admin":
        raise PermissionDenied("Admin privileges required")
```

**Usage in an endpoint:**

```python
@router.get("/admin/reports", auth=JWTAuth())
def get_admin_reports(request):
    admin_required(request.auth)
    return {"reports": generate_all_reports()}
```

---

## Frontend Enforcement

The frontend mirrors backend roles using the current authenticated user’s payload.

**Example Context Hook:**

```typescript
import { createContext, useContext } from "react";

const AuthContext = createContext({ user: null });

export function usePermissions() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  return { isAdmin };
}
```

**Example Conditional Rendering:**

```tsx
{
  isAdmin && <AdminDashboard />;
}
{
  !isAdmin && <UserPanel />;
}
```

---

## API Role Enforcement

All API routes define permission decorators or dependencies.

| Decorator                 | Description                               |
| ------------------------- | ----------------------------------------- |
| `@login_required`         | Requires authentication.                  |
| `@admin_required`         | Restricts access to admin-only endpoints. |
| `@self_or_admin_required` | Allows access to own data or admin users. |

**Example Decorator Implementation:**

```python
def self_or_admin_required(func):
    def wrapper(request, *args, **kwargs):
        if request.user.role == "admin" or request.user.id == kwargs.get("user_id"):
            return func(request, *args, **kwargs)
        raise PermissionDenied("Access denied.")
    return wrapper
```

---

## Permissions in Database Queries

To prevent privilege escalation, every query filters by user context unless explicitly overridden for admin roles.

**Example Safe Query:**

```python
def get_user_tickets(user):
    if user.is_admin():
        return Ticket.objects.all()
    return Ticket.objects.filter(borrower=user)
```

---

## Admin Dashboard Permissions

The admin dashboard is accessible only to users with the `admin` role.  
It allows the following operations:

- View all users and wallets.
- Manage ticket approvals and status transitions.
- Generate and export financial reports.
- Broadcast notifications to all users.

---

## Security Considerations

- Tokens include user role claims (`role=admin` or `role=user`).
- Backend authorization always takes precedence over frontend visibility.
- Sensitive endpoints enforce both **JWT validation** and **role checks**.
- Logs include user ID and role for every API call.
- Attempted access violations are recorded for audit.

---

## Future Role Extensions

| Planned Role      | Description                                             |
| ----------------- | ------------------------------------------------------- |
| **Moderator**     | Manage and verify asset listings.                       |
| **Auditor**       | Read-only access to financial reports and logs.         |
| **Support Agent** | Handle ticket and user inquiries via support dashboard. |

---

## Testing Permissions

**Example Tests:**

```python
def test_user_cannot_access_admin_endpoints(client, user):
    client.force_authenticate(user)
    response = client.get("/api/v1/admin/reports/")
    assert response.status_code == 403

def test_admin_can_access_reports(client, admin_user):
    client.force_authenticate(admin_user)
    response = client.get("/api/v1/admin/reports/")
    assert response.status_code == 200
```

---

## Summary

| Component              | Enforcement Location       |
| ---------------------- | -------------------------- |
| **JWT & OAuth Tokens** | Authentication Layer       |
| **Role Checks**        | Middleware and Endpoints   |
| **UI Restrictions**    | Frontend Components        |
| **Database Filters**   | Querysets and Repositories |

Together, these ensure that data access is consistent, secure, and auditable across the entire system.

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
