from ninja import Router

router = Router(tags=["Reports"])


@router.get("status", summary="Reports service heartbeat")
def reports_status(request):
    return {"service": "reports", "status": "ok"}
