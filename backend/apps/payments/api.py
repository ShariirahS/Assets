from ninja import Router

router = Router(tags=["Payments"])


@router.get("status", summary="Payments service heartbeat")
def payments_status(request):
    return {"service": "payments", "status": "ok"}
