# Dashboards & Reporting Guide

## Overview

The **Assets** platform provides interactive dashboards and analytical reports to give users and administrators real-time insights into system activity.  
This guide describes how reporting data is collected, processed, and visualized within both the **frontend** (Next.js + Recharts) and **backend** (Django + Ninja) systems.

---

## Goals

- Provide **real-time visibility** into user activity and transactions.
- Offer **role-based dashboards** for users and admins.
- Generate **financial and operational reports** for audits.
- Enable **data aggregation** and **trend analysis** over time.

---

## Dashboard Types

| Dashboard             | Audience       | Description                                                    |
| --------------------- | -------------- | -------------------------------------------------------------- |
| **User Dashboard**    | Regular Users  | Displays wallet balance, ticket history, and activity summary. |
| **Admin Dashboard**   | Administrators | Monitors global metrics, financial summaries, and system logs. |
| **Reports Dashboard** | Management     | Aggregated analytics with exportable reports.                  |

---

## Data Sources

Dashboards pull data from multiple backend services and tables:

| Source          | Description                                   |
| --------------- | --------------------------------------------- |
| `wallets`       | Tracks user balances and transactions.        |
| `tickets`       | Stores asset lending and borrowing activity.  |
| `payments`      | Logs verified transactions from Zarinpal.     |
| `reports`       | Pre-aggregated daily metrics for performance. |
| `notifications` | Logs of user alerts and message statuses.     |

---

## Backend Architecture

The backend reporting engine is implemented under the `reports` app.

**Key Modules:**
| Module | Description |
|---------|-------------|
| `models.py` | Defines the `Report` and `AnalyticsRecord` models. |
| `tasks.py` | Handles nightly aggregation jobs. |
| `views.py` | Exposes `/reports/overview/` and `/reports/metrics/` endpoints. |
| `serializers.py` | Converts report objects to JSON format for the frontend. |

**Example Model:**

```python
class Report(models.Model):
    report_date = models.DateField(auto_now_add=True)
    total_users = models.IntegerField(default=0)
    total_tickets = models.IntegerField(default=0)
    active_loans = models.IntegerField(default=0)
    total_volume = models.DecimalField(max_digits=18, decimal_places=2, default=0)
```

---

## Aggregation Process

Reports are generated through a combination of scheduled jobs and on-demand API requests.

**Nightly Job (Celery Task):**

```python
@shared_task
def generate_daily_report():
    total_users = User.objects.count()
    total_tickets = Ticket.objects.count()
    active_loans = Ticket.objects.filter(status="active").count()
    total_volume = Payment.objects.filter(status="verified").aggregate(Sum("amount"))["amount__sum"] or 0

    Report.objects.create(
        total_users=total_users,
        total_tickets=total_tickets,
        active_loans=active_loans,
        total_volume=total_volume,
    )
```

**On-Demand API Example:**

```python
@router.get("/reports/overview/")
def get_reports(request):
    return Report.objects.order_by("-report_date")[:30]
```

---

## Frontend Implementation

Frontend dashboards are built with **Next.js**, **HeroUI**, and **Recharts** for rich data visualization.

### Example Layout

```
frontend/app/(dashboard)/page.tsx
├── DashboardHeader.tsx
├── WalletSummary.tsx
├── TicketStats.tsx
└── Charts.tsx
```

### Chart Example (Recharts)

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TicketTrend({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="active_loans" stroke="#0ea5e9" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### API Call Example

```typescript
const { data } = await api.get("/reports/overview/");
setReports(data);
```

---

## Key Metrics Displayed

| Metric              | Description                                  |
| ------------------- | -------------------------------------------- |
| **Total Users**     | Registered users in the system.              |
| **Active Loans**    | Number of ongoing lending agreements.        |
| **Total Tickets**   | All tickets created to date.                 |
| **Total Volume**    | Total IRR volume processed through payments. |
| **Wallet Balances** | Aggregate sum of all user wallet balances.   |

---

## Admin Dashboard Features

- **Data Overview Cards:** Display total users, loans, and revenue.
- **Ticket Monitoring:** Active vs. completed ticket ratio.
- **Revenue Analysis:** Daily and monthly transaction trends.
- **Export Reports:** CSV and PDF export for financial audits.
- **Filters:** Time range, asset type, or user segment filters.

**Example Admin Chart:**  
A bar chart showing daily transaction volume and new user signups.

```typescript
<BarChart data={reportData}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="total_volume" fill="#22c55e" />
  <Bar dataKey="total_users" fill="#3b82f6" />
</BarChart>
```

---

## Exports & Integrations

Reports can be exported or shared via integrations.

| Format  | Usage                                                        |
| ------- | ------------------------------------------------------------ |
| **CSV** | Data export for analysis in spreadsheets.                    |
| **PDF** | Printable summaries for stakeholders.                        |
| **API** | JSON output for integrations or third-party analytics tools. |

**Example Export Command:**

```bash
python manage.py export_reports --format=csv --output=reports_2025.csv
```

---

## Performance Considerations

- Reports are **cached** in Redis for fast retrieval.
- Heavy queries are executed asynchronously.
- Charts and tables use lazy loading and pagination.
- Indexes on `report_date` and `status` fields improve query speed.

---

## Security & Access Control

| Role                 | Access Level                              |
| -------------------- | ----------------------------------------- |
| **Admin**            | Full access to all reports and analytics. |
| **User**             | Access limited to their own statistics.   |
| **Auditor (future)** | Read-only access to financial reports.    |

Reports are served via authenticated endpoints with **JWT** and **role-based access control (RBAC)**.

---

## Future Enhancements

- Real-time updates using WebSockets.
- Predictive analytics using historical data.
- Interactive filtering with drill-down reports.
- Multi-currency and regional reporting support.
- AI-driven anomaly detection for transactions.

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
