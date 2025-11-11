from ninja import Router

router = Router(tags=["Auth"])


@router.get("status", summary="Authentication service heartbeat")
def auth_status(request):
    return {"service": "auth", "status": "ok"}
