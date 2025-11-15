from __future__ import annotations

from decimal import Decimal

from django.db.models import Q, Sum
from django.db.models.functions import Coalesce
from ninja import Router
from ninja.errors import HttpError

from apps.auth.dependencies import JWTAuth
from apps.payments.models import Payment

from .models import Wallet


jwt_auth = JWTAuth()
router = Router(tags=["Wallet"])


@router.get("status", summary="Wallet service heartbeat")
def wallet_status(request):
    return {"service": "wallet", "status": "ok"}


@router.get("overview", auth=jwt_auth, summary="Return wallet summary and transactions for the current user")
def wallet_overview(request):
    try:
        wallet = Wallet.objects.get(user=request.user)
    except Wallet.DoesNotExist as exc:  # pragma: no cover - defensive guard
        raise HttpError(404, "Wallet not found for user") from exc

    payments = (
        Payment.objects.filter(
            Q(ticket__borrower=request.user) | Q(ticket__lender=request.user)
        )
        .select_related("ticket")
        .order_by("-created_at")
    )

    total_payments = payments.count()
    verified_count = payments.filter(status=Payment.Status.VERIFIED).count()
    settlement_buffer = int(round((verified_count / total_payments) * 100)) if total_payments else 0

    upcoming_amount = payments.filter(status=Payment.Status.INITIATED).aggregate(
        total=Coalesce(Sum("amount"), Decimal("0"))
    )["total"]

    def payment_category(payment: Payment) -> str:
        if payment.status == Payment.Status.INITIATED:
            return "Top-up"
        if payment.status == Payment.Status.VERIFIED:
            return "Settlement"
        return "Payout"

    transactions = [
        {
            "id": payment.id,
            "reference": payment.authority,
            "ticketId": payment.ticket_id,
            "ticketAsset": payment.ticket.asset_name,
            "type": payment_category(payment),
            "amount": float(payment.amount),
            "status": payment.status,
            "statusLabel": payment.get_status_display(),
            "createdAt": payment.created_at,
        }
        for payment in payments[:10]
    ]

    return {
        "wallet": {
            "balance": float(wallet.balance),
            "currency": wallet.currency,
            "status": wallet.status,
            "settlementBuffer": settlement_buffer,
            "upcomingPayouts": float(upcoming_amount or Decimal("0")),
        },
        "transactions": transactions,
    }
