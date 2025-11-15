from __future__ import annotations

import logging
import os
from datetime import timedelta
from decimal import Decimal
from typing import Iterable

from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import DEFAULT_DB_ALIAS, connections
from django.db.models import Q, Sum
from django.db.models.functions import Coalesce
from django.db.utils import OperationalError, ProgrammingError
from django.utils import timezone


logger = logging.getLogger(__name__)


def _database_has_tables(model_labels: Iterable[str]) -> bool:
    connection = connections[DEFAULT_DB_ALIAS]
    try:
        table_names = set(connection.introspection.table_names())
    except (OperationalError, ProgrammingError):
        return False

    resolved_tables = []
    for label in model_labels:
        try:
            model = apps.get_model(label)
        except LookupError:
            return False
        resolved_tables.append(model._meta.db_table)

    return all(table in table_names for table in resolved_tables)


def seed_dev_data() -> None:
    if os.getenv("PYTEST_CURRENT_TEST"):
        return

    if not settings.DEBUG:
        return

    required_models = (
        "assets_auth.User",
        "assets_wallet.Wallet",
        "assets_tickets.Ticket",
        "assets_payments.Payment",
        "assets_notifications.Notification",
    )

    if not _database_has_tables(required_models):
        return

    user_model = get_user_model()

    try:
        admin = user_model.objects.get(email="admin@example.com")
    except user_model.DoesNotExist:
        admin = user_model.objects.create_superuser(
            email="admin@example.com",
            password="AdminPass123!",
            first_name="Dev",
            last_name="Admin",
        )

    try:
        borrower = user_model.objects.get(email="user@example.com")
    except user_model.DoesNotExist:
        borrower = user_model.objects.create_user(
            email="user@example.com",
            password="UserPass123!",
            first_name="Demo",
            last_name="User",
            role=user_model.Role.USER,
        )

    wallet_model = apps.get_model("assets_wallet", "Wallet")
    admin_wallet, _ = wallet_model.objects.get_or_create(
        user=admin,
        defaults={
            "balance": Decimal("12450000.00"),
            "currency": "IRR",
            "status": wallet_model.Status.ACTIVE,
        },
    )
    borrower_wallet, _ = wallet_model.objects.get_or_create(
        user=borrower,
        defaults={
            "balance": Decimal("3620000.00"),
            "currency": "IRR",
            "status": wallet_model.Status.ACTIVE,
        },
    )

    ticket_model = apps.get_model("assets_tickets", "Ticket")
    ticket_defaults = [
        {
            "asset_name": "Dell XPS 15",
            "borrower": borrower,
            "lender": admin,
            "price": Decimal("550000.00"),
            "duration_days": 14,
            "status": ticket_model.Status.ACTIVE,
        },
        {
            "asset_name": "Canon EOS R6",
            "borrower": borrower,
            "lender": admin,
            "price": Decimal("820000.00"),
            "duration_days": 7,
            "status": ticket_model.Status.ACCEPTED,
        },
        {
            "asset_name": "MacBook Pro 14",
            "borrower": admin,
            "lender": borrower,
            "price": Decimal("960000.00"),
            "duration_days": 10,
            "status": ticket_model.Status.PENDING,
        },
    ]

    tickets = []
    for defaults in ticket_defaults:
        ticket, _ = ticket_model.objects.get_or_create(
            asset_name=defaults["asset_name"],
            borrower=defaults["borrower"],
            lender=defaults["lender"],
            defaults={key: value for key, value in defaults.items() if key not in {"asset_name", "borrower", "lender"}},
        )
        tickets.append(ticket)

    payment_model = apps.get_model("assets_payments", "Payment")
    payment_payloads = [
        {
            "ticket": tickets[0],
            "authority": "AUTH-0001",
            "ref_id": 8834210011,
            "amount": Decimal("550000.00"),
            "status": payment_model.Status.VERIFIED,
            "verified_at": timezone.now() - timedelta(days=1),
        },
        {
            "ticket": tickets[1],
            "authority": "AUTH-0002",
            "ref_id": None,
            "amount": Decimal("820000.00"),
            "status": payment_model.Status.INITIATED,
            "verified_at": None,
        },
        {
            "ticket": tickets[2],
            "authority": "AUTH-0003",
            "ref_id": None,
            "amount": Decimal("960000.00"),
            "status": payment_model.Status.FAILED,
            "verified_at": None,
        },
    ]

    for payload in payment_payloads:
        defaults = payload.copy()
        ticket = defaults.pop("ticket")
        payment_model.objects.update_or_create(ticket=ticket, defaults=defaults)

    notification_model = apps.get_model("assets_notifications", "Notification")
    notification_payloads = [
        {
            "user": borrower,
            "channel": notification_model.Channel.EMAIL,
            "message": "Your Dell XPS 15 rental is now active.",
            "status": notification_model.Status.SENT,
            "sent_at": timezone.now() - timedelta(hours=6),
        },
        {
            "user": borrower,
            "channel": notification_model.Channel.SMS,
            "message": "Payment AUTH-0002 requires verification.",
            "status": notification_model.Status.QUEUED,
            "sent_at": None,
        },
        {
            "user": admin,
            "channel": notification_model.Channel.WHATSAPP,
            "message": "Ticket MacBook Pro 14 was requested by Demo User.",
            "status": notification_model.Status.SENT,
            "sent_at": timezone.now() - timedelta(hours=2),
        },
    ]

    for payload in notification_payloads:
        notification_model.objects.get_or_create(
            user=payload["user"],
            message=payload["message"],
            defaults={key: value for key, value in payload.items() if key not in {"user", "message"}},
        )

    # Keep wallet balances roughly aligned with payment activity
    for wallet in (admin_wallet, borrower_wallet):
        total_outgoing = (
            payment_model.objects.filter(
                Q(ticket__borrower=wallet.user) | Q(ticket__lender=wallet.user),
                status=payment_model.Status.INITIATED,
            ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
        )
        if total_outgoing:
            wallet.balance = Decimal(wallet.balance) - total_outgoing / Decimal("20")
            wallet.save(update_fields=["balance"])

    logger.info(
        "Seeded development data for wallets, tickets, payments, and notifications (admin id=%s, user id=%s)",
        admin.id,
        borrower.id,
    )
