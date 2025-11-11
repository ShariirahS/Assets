from ninja import Router

router = Router(tags=["Tickets"])


@router.get("status", summary="Tickets service heartbeat")
def tickets_status(request):
    return {"service": "tickets", "status": "ok"}
