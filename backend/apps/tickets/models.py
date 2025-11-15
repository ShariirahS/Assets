from django.conf import settings
from django.db import models


class Ticket(models.Model):
    """Asset lending ticket linking borrowers and lenders."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    asset_name = models.CharField(max_length=255)
    borrower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="borrowed_tickets",
    )
    lender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lent_tickets",
    )
    price = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    duration_days = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["borrower", "lender"], name="idx_tickets_borrower_lender"),
            models.Index(fields=["status"], name="idx_tickets_status"),
        ]
        verbose_name = "Ticket"
        verbose_name_plural = "Tickets"

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"Ticket<{self.pk}>"
