from __future__ import annotations

from datetime import datetime, timedelta
from decimal import Decimal

from django.db.models import Q, Sum
from django.db.models.functions import Coalesce, TruncDate
from django.utils import timezone
from ninja import Router

from apps.auth.dependencies import JWTAuth
from apps.notifications.models import Notification
from apps.payments.models import Payment
from apps.tickets.models import Ticket
from apps.wallet.models import Wallet


jwt_auth = JWTAuth()
router = Router(tags=["Reports"])


@router.get("status", summary="Reports service heartbeat")
def reports_status(request):
    return {"service": "reports", "status": "ok"}


@router.get("dashboard", auth=jwt_auth, summary="Dashboard snapshot for the current user")
def dashboard_snapshot(request):
    wallet = Wallet.objects.filter(user=request.user).first()
    currency = wallet.currency if wallet else "IRR"
    wallet_balance = float(wallet.balance) if wallet else 0.0

    ticket_qs = Ticket.objects.filter(Q(borrower=request.user) | Q(lender=request.user))
    active_tickets = ticket_qs.filter(status=Ticket.Status.ACTIVE).count()

    pending_payouts = Payment.objects.filter(
        Q(ticket__borrower=request.user) | Q(ticket__lender=request.user),
        status=Payment.Status.INITIATED,
    ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]

    metrics = [
        {"label": "Active Tickets", "value": active_tickets, "unit": None},
        {
            "label": "Wallet Balance",
            "value": wallet_balance,
            "unit": currency,
        },
        {
            "label": "Pending Payouts",
            "value": float(pending_payouts or Decimal("0")),
            "unit": currency,
        },
    ]

    today = timezone.now().date()
    days_back = 4
    start_date = today - timedelta(days=days_back)

    verified_payments = Payment.objects.filter(
        Q(ticket__borrower=request.user) | Q(ticket__lender=request.user),
        status=Payment.Status.VERIFIED,
        created_at__date__gte=start_date,
    )

    daily_totals = {
        entry["day"]: float(entry["total"])
        for entry in (
            verified_payments.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(total=Coalesce(Sum("amount"), Decimal("0")))
        )
    }

    performance = []
    for offset in range(days_back, -1, -1):
        day = today - timedelta(days=offset)
        performance.append({"label": day.strftime("%a"), "value": daily_totals.get(day, 0.0)})

    activities: list[tuple[datetime, dict[str, object]]] = []

    for ticket in ticket_qs.order_by("-updated_at")[:3]:
        activities.append(
            (
                ticket.updated_at,
                {
                    "id": f"ticket-{ticket.id}",
                    "message": f"Ticket {ticket.asset_name} marked {ticket.get_status_display().lower()}",
                    "category": "ticket",
                    "timestamp": ticket.updated_at,
                },
            )
        )

    for payment in (
        Payment.objects.filter(Q(ticket__borrower=request.user) | Q(ticket__lender=request.user))
        .select_related("ticket")
        .order_by("-created_at")
        [:3]
    ):
        activities.append(
            (
                payment.created_at,
                {
                    "id": f"payment-{payment.id}",
                    "message": f"Payment {payment.authority} {payment.get_status_display().lower()}",
                    "category": "payment",
                    "timestamp": payment.created_at,
                },
            )
        )

    for notification in Notification.objects.filter(user=request.user).order_by("-created_at")[:3]:
        activities.append(
            (
                notification.created_at,
                {
                    "id": f"notification-{notification.id}",
                    "message": notification.message,
                    "category": "notification",
                    "timestamp": notification.created_at,
                },
            )
        )

    activities.sort(key=lambda item: item[0], reverse=True)
    recent_activity = [activity for _, activity in activities[:5]]

    return {
        "metrics": metrics,
        "performance": performance,
        "recentActivity": recent_activity,
    }
