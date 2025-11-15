from __future__ import annotations

from django.db.models import Q
from ninja import Router

from apps.auth.dependencies import JWTAuth

from .models import Ticket


jwt_auth = JWTAuth()
router = Router(tags=["Tickets"])


@router.get("status", summary="Tickets service heartbeat")
def tickets_status(request):
    return {"service": "tickets", "status": "ok"}


@router.get("", auth=jwt_auth, summary="List tickets associated with the current user")
def list_tickets(request):
    tickets = (
        Ticket.objects.filter(Q(borrower=request.user) | Q(lender=request.user))
        .select_related("borrower", "lender")
        .order_by("-updated_at")
    )

    return [
        {
            "id": ticket.id,
            "assetName": ticket.asset_name,
            "status": ticket.status,
            "statusLabel": ticket.get_status_display(),
            "borrower": ticket.borrower.full_name or ticket.borrower.email,
            "lender": ticket.lender.full_name or ticket.lender.email,
            "updatedAt": ticket.updated_at,
        }
        for ticket in tickets
    ]
