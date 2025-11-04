# Testing Guide

## Overview

The **Assets** platform includes a comprehensive testing strategy to ensure the reliability, security, and correctness of both backend and frontend components.  
Testing is automated using **PyTest**, **Django Test Client**, and **Playwright**, with continuous integration handled through GitHub Actions.

---

## Goals

- Maintain **high code quality** through consistent automated tests.
- Validate **API integrity** and **business logic correctness**.
- Ensure **frontend-backend integration** remains stable.
- Catch regressions early via CI/CD pipelines.

---

## Testing Layers

| Layer                 | Framework / Tool   | Description                              |
| --------------------- | ------------------ | ---------------------------------------- |
| **Unit Tests**        | PyTest             | Test isolated functions and methods      |
| **Integration Tests** | Django Test Client | Verify API endpoints and DB transactions |
| **E2E Tests**         | Playwright         | Simulate full user flows in browser      |
| **Static Analysis**   | Ruff / Bandit      | Linting and security checks              |
| **Load Tests**        | Locust             | Evaluate performance under stress        |

---

## Backend Testing

### 1. Unit Tests

- Use **PyTest** for lightweight, fast-running tests.
- Tests cover models, services, and utility functions.

**Example (`tests/test_wallet.py`):**

```python
import pytest
from apps.wallet.models import Wallet

@pytest.mark.django_db
def test_wallet_balance_update():
    wallet = Wallet.objects.create(user_id=1, balance=100)
    wallet.balance += 50
    wallet.save()
    assert wallet.balance == 150
```

Run all unit tests:

```bash
pytest -v
```

### 2. Integration Tests

Integration tests use **Django Test Client** to simulate API requests.

**Example (`tests/test_tickets.py`):**

```python
from django.test import Client

def test_create_ticket():
    client = Client()
    client.login(email="user@example.com", password="1234")
    response = client.post("/api/v1/tickets/", {"asset_name": "Camera", "price": 100, "duration_days": 5})
    assert response.status_code == 200
```

Run integration tests with:

```bash
pytest tests/ --disable-warnings
```

---

## Frontend Testing

### 1. Unit & Component Tests

**Tool:** Jest + React Testing Library  
Tests verify rendering, props, and user interactions.

**Example:**

```typescript
import { render, screen } from "@testing-library/react";
import WalletCard from "@/components/dashboard/WalletCard";

test("renders wallet balance", () => {
  render(<WalletCard balance={1000} />);
  expect(screen.getByText("1000")).toBeInTheDocument();
});
```

Run frontend tests:

```bash
npm run test
```

### 2. End-to-End (E2E) Tests

**Tool:** Playwright  
Simulates real browser interactions.

**Example Scenario:**

1. User logs in.
2. Creates a new lending ticket.
3. Completes payment flow.

**Example Test (`tests/e2e/login.spec.ts`):**

```typescript
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/login");
  await page.fill("input[name=email]", "user@example.com");
  await page.fill("input[name=password]", "1234");
  await page.click("button[type=submit]");
  await expect(page).toHaveURL("/dashboard");
});
```

Run E2E tests:

```bash
npx playwright test
```

---

## Continuous Integration (CI)

GitHub Actions automatically runs tests on each pull request.

**Example Workflow (`.github/workflows/test.yml`):**

```yaml
name: CI Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: assets
          POSTGRES_USER: user
          POSTGRES_PASSWORD: pass
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.11
      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt
          npm ci --prefix frontend
      - name: Run Backend Tests
        run: pytest backend/tests/
      - name: Run Frontend Tests
        run: npm test --prefix frontend
```

---

## Test Data and Fixtures

### Seed Data

Seed scripts provide initial data for consistent test environments.

**Command:**

```bash
python manage.py loaddata seed_data.json
```

### PyTest Fixtures

Reusable components for user creation, wallet initialization, and ticket seeding.

**Example:**

```python
@pytest.fixture
def user(db, django_user_model):
    return django_user_model.objects.create_user(email="user@example.com", password="1234")
```

---

## Performance & Load Testing

Use **Locust** for concurrent user simulations.

**Example:**

```python
from locust import HttpUser, task

class AssetsUser(HttpUser):
    @task
    def view_dashboard(self):
        self.client.get("/api/v1/reports/overview/")
```

Run load test:

```bash
locust -f locustfile.py
```

---

## Security Testing

| Tool          | Purpose                                      |
| ------------- | -------------------------------------------- |
| **Bandit**    | Detect insecure Python code                  |
| **Safety**    | Check dependencies for known vulnerabilities |
| **OWASP ZAP** | Automated web security scanning              |

Example command:

```bash
bandit -r backend/
safety check -r backend/requirements.txt
```

---

## Coverage Reports

Generate test coverage reports to ensure code completeness.

```bash
pytest --cov=apps --cov-report=html
```

View results in `htmlcov/index.html`.

---

## Best Practices

- Test both **happy** and **failure** paths.
- Keep tests **idempotent** and **independent**.
- Use **factory methods** for repeatable data creation.
- Run tests before each deployment.
- Use GitHub badges to display CI test status.

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
