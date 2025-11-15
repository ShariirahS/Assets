from django.db import models


class Payment(models.Model):
    """Zarinpal payment associated with a ticket."""

    class Status(models.TextChoices):
        INITIATED = "initiated", "Initiated"
        VERIFIED = "verified", "Verified"
        FAILED = "failed", "Failed"

    ticket = models.OneToOneField(
        "assets_tickets.Ticket",
        on_delete=models.CASCADE,
        related_name="payment",
    )
    authority = models.CharField(max_length=64)
    ref_id = models.BigIntegerField(null=True, blank=True)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INITIATED)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["authority"], name="idx_payments_authority"),
        ]
        indexes = [
            models.Index(fields=["ref_id"], name="idx_payments_ref"),
        ]
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"Payment<{self.pk}>"
