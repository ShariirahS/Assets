from __future__ import annotations

from ninja import Router

from apps.auth.dependencies import JWTAuth

from .models import Notification


jwt_auth = JWTAuth()
router = Router(tags=["Notifications"])


@router.get("status", summary="Notifications service heartbeat")
def notifications_status(request):
    return {"service": "notifications", "status": "ok"}


@router.get("recent", auth=jwt_auth, summary="Return the latest notifications for the current user")
def recent_notifications(request):
    notifications = Notification.objects.filter(user=request.user).order_by("-created_at")[:10]

    return [
        {
            "id": notification.id,
            "channel": notification.channel,
            "channelLabel": notification.get_channel_display(),
            "status": notification.status,
            "statusLabel": notification.get_status_display(),
            "message": notification.message,
            "createdAt": notification.created_at,
        }
        for notification in notifications
    ]
