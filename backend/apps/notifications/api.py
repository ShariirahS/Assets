from ninja import Router

router = Router(tags=["Notifications"])


@router.get("status", summary="Notifications service heartbeat")
def notifications_status(request):
    return {"service": "notifications", "status": "ok"}
