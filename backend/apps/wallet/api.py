from ninja import Router

router = Router(tags=["Wallet"])


@router.get("status", summary="Wallet service heartbeat")
def wallet_status(request):
    return {"service": "wallet", "status": "ok"}
