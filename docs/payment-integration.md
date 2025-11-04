# Payment Integration Guide

## Overview

This document describes the **Zarinpal payment integration** and wallet transaction flow used in the **Assets** platform.  
It ensures secure, auditable, and atomic payment operations across user wallets and the external payment gateway.

---

## Payment Gateway: Zarinpal

The platform integrates **Zarinpal** as the primary payment processor for handling IRR (Iranian Rial) transactions.  
All communications with Zarinpal APIs are done over **HTTPS** with signed requests to prevent tampering.

### Base URLs

- **Sandbox:** `https://sandbox.zarinpal.com/pg/rest/WebGate/`
- **Production:** `https://www.zarinpal.com/pg/rest/WebGate/`

### Required Credentials

| Environment Variable    | Description                             |
| ----------------------- | --------------------------------------- |
| `ZARINPAL_MERCHANT_ID`  | Unique merchant identifier              |
| `ZARINPAL_CALLBACK_URL` | Backend endpoint for verifying payments |
| `ZARINPAL_SANDBOX`      | Boolean flag for sandbox testing        |

---

## Payment Workflow

### 1. Initiate Transaction

1. User initiates a ticket acceptance or lending action that triggers a payment.
2. Backend generates a **unique order ID** and records a pending transaction in the wallet ledger.
3. The system sends a `PaymentRequest` to Zarinpal including:
   - `merchant_id`
   - `amount`
   - `callback_url`
   - `description`
   - `metadata` (user ID, ticket ID)

**Example Request:**

```json
{
  "merchant_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "amount": 150000,
  "description": "Asset lending payment for Ticket #123",
  "callback_url": "https://api.assets.example.com/api/v1/payments/verify/",
  "metadata": { "ticket_id": 123, "user_id": 12 }
}
```

**Example Response:**

```json
{
  "data": {
    "code": 100,
    "message": "Payment request accepted",
    "authority": "A00000000000000000000000000123456789"
  }
}
```

4. The frontend redirects the user to Zarinpal’s payment page using the authority code.

---

### 2. Verify Transaction (Callback)

After the user completes the payment, Zarinpal redirects back to the callback URL with query parameters:

```
https://api.assets.example.com/api/v1/payments/verify/?Authority=A00000000000000000000000000123456789&Status=OK
```

The backend then calls Zarinpal’s `/PaymentVerification` API to confirm the payment status.

**Example Request:**

```json
{
  "merchant_id": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "amount": 150000,
  "authority": "A00000000000000000000000000123456789"
}
```

**Example Response:**

```json
{
  "data": {
    "code": 100,
    "ref_id": 987654321,
    "message": "Transaction verified successfully"
  }
}
```

If verification succeeds:

- Wallet balance is credited.
- Ticket status updates to `active`.
- A transaction log entry is created with reference ID.

If verification fails:

- Wallet remains unchanged.
- Ticket remains in `pending` state.
- Failure reason logged for audit.

---

## Wallet and Ledger Synchronization

| Step | Operation                   | Description                                                       |
| ---- | --------------------------- | ----------------------------------------------------------------- |
| 1    | Create Pending Ledger Entry | Record initiated transaction before redirecting user              |
| 2    | Verify Payment              | Confirm status from Zarinpal via callback                         |
| 3    | Commit Ledger Entry         | On success, mark as `completed` and credit wallet                 |
| 4    | Reconcile                   | Regularly check discrepancies between local logs and Zarinpal API |

- Ledger entries are immutable; corrections use reversal entries.
- All wallet operations run within **atomic DB transactions**.

---

## Error Handling

| Code | Meaning               | Recommended Action               |
| ---- | --------------------- | -------------------------------- |
| 100  | Success               | Payment verified                 |
| 101  | Already Verified      | Ignore duplicate callback        |
| -9   | Invalid Input         | Check parameters                 |
| -22  | Merchant Disabled     | Contact Zarinpal support         |
| -40  | Invalid Merchant ID   | Verify environment configuration |
| -54  | Transaction Not Found | Check authority code and amount  |

All failures trigger notifications and log entries with the full response payload.

---

## Security Practices

- Use **HMAC-SHA256** signatures for request verification.
- All credentials are stored as environment variables and **never committed** to Git.
- Callback requests are validated by IP whitelisting and authority verification.
- Each payment request includes anti-replay nonce fields and timestamps.
- SSL/TLS enforced across all payment communications.

---

## Testing in Sandbox Mode

Set `ZARINPAL_SANDBOX=true` in your environment.  
Sandbox responses mimic live transactions and allow testing without real payments.

Example testing card:

```
Card Number: 6104-3377-7777-7777
Password: 123
CVV2: 111
Expire Date: 12/1404
```

---

## Reconciliation and Reporting

- Daily reconciliation compares local transactions with Zarinpal’s report API.
- Mismatches trigger an automated alert and manual review task.
- Admin dashboard displays summary metrics:
  - Total processed payments
  - Failed/verifications pending
  - Daily transaction volume

---

## Future Enhancements

- Add multi-gateway abstraction for supporting Stripe or PayPal.
- Integrate refund processing and partial settlements.
- Automate invoice generation and email confirmations.
- Expand payment webhooks for real-time notifications.

---

**Maintainer:** [Shahriyar (shari-ar)](https://github.com/shari-ar)  
**Version:** 1.0.0  
**License:** MIT
