from ninja import NinjaAPI

from apps.auth.api import router as auth_router
from apps.notifications.api import router as notifications_router
from apps.payments.api import router as payments_router
from apps.reports.api import router as reports_router
from apps.tickets.api import router as tickets_router
from apps.wallet.api import router as wallet_router

api = NinjaAPI(title="Assets API", version="0.1.0")


@api.get("/health", tags=["Health"], summary="Backend service heartbeat")
def health(request):
    return {"status": "ok"}


def register_routers() -> None:
    api.add_router("auth/", auth_router)
    api.add_router("wallet/", wallet_router)
    api.add_router("tickets/", tickets_router)
    api.add_router("payments/", payments_router)
    api.add_router("reports/", reports_router)
    api.add_router("notifications/", notifications_router)


register_routers()
