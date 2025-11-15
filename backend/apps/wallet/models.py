from django.conf import settings
from django.db import models


class Wallet(models.Model):
    """Wallet holding a user's current IRR balance."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        FROZEN = "frozen", "Frozen"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallet",
    )
    balance = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default="IRR")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"], name="idx_wallets_user"),
        ]
        verbose_name = "Wallet"
        verbose_name_plural = "Wallets"

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"Wallet<{self.user_id}>"
