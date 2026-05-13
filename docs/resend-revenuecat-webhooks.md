# Resend + RevenueCat Webhooks

This replaces the GoHighLevel/Make email sequence with Still-owned Vercel webhooks that send through Resend.

## Webhook URLs

Use these URLs after the deployment is live:

- Initial purchase sequence:
  - `https://stillmeditation.app/api/revenuecat/initial-purchase`
- General RevenueCat event owner notifications:
  - `https://stillmeditation.app/api/revenuecat/events`
- Cancellation owner + customer email:
  - `https://stillmeditation.app/api/revenuecat/cancellation`

## Behavior

### Initial purchase

When the endpoint receives `INITIAL_PURCHASE`:

- Sends owner notification immediately.
- Sends customer email 1 immediately.
- Schedules customer email 2 for `in 1 day`.
- Schedules customer email 3 for `in 2 days`.

### General events

For events such as `RENEWAL`, `PRODUCT_CHANGE`, `BILLING_ISSUE`, and similar:

- Sends owner notification with the event summary and raw payload.

### Cancellation

When the endpoint receives `CANCELLATION`:

- Sends owner notification immediately.
- Sends customer cancellation email immediately.

## Required Vercel Environment Variables

- `RESEND_API_KEY`
  - Resend API key.
  - Use a sending-only key restricted to the verified Still sending domain if possible.
- `RESEND_FROM_EMAIL`
  - Recommended: `Akinyemi from Still <aki.b@stillapp.us>`
- `OWNER_NOTIFICATION_EMAIL`
  - Recommended: `aki.b@pentridgemedia.com`
- `REVENUECAT_WEBHOOK_AUTH`
  - Optional but recommended.
  - Set this to the exact authorization header value configured in RevenueCat.
- `RESEND_REPLY_TO`
  - Optional.
  - Defaults to `aki.b@stillapp.us`.

## RevenueCat Setup

In RevenueCat:

1. Add a webhook integration for initial purchases.
2. Point it to `/api/revenuecat/initial-purchase`.
3. Filter to `INITIAL_PURCHASE`.
4. Add a webhook integration for cancellations.
5. Point it to `/api/revenuecat/cancellation`.
6. Filter to `CANCELLATION`.
7. Add a webhook integration for other owner notifications.
8. Point it to `/api/revenuecat/events`.
9. Filter to the remaining events you want owner notifications for.
10. Configure an authorization header and copy the same value into `REVENUECAT_WEBHOOK_AUTH`.

## Customer Email Requirement

The customer sequence can only be sent if the RevenueCat payload includes an email address.

The webhook checks:

- `event.subscriber_attributes.$email.value`
- `event.subscriber_attributes.email.value`
- `event.app_user_id` if it is an email
- `event.original_app_user_id` if it is an email
- aliases if any alias is an email

If RevenueCat does not include an email, the owner notification is still sent, but the customer email is skipped.

## Security Notes

The Resend API key was pasted into chat during setup. Rotate it before production use and update `RESEND_API_KEY` with the new value.

Resend idempotency keys are used for each email request, but they expire after 24 hours. For long-term duplicate protection, add persistent event storage later.

## Current Production Status

The webhook URLs are deployed and their health checks pass.

Configured in Vercel production:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `OWNER_NOTIFICATION_EMAIL`

Known blocker:

- Resend rejected a live test because `stillapp.us` is not verified in Resend.
- Verify `stillapp.us` in Resend, or change `RESEND_FROM_EMAIL` to a verified sending domain before enabling the RevenueCat webhooks.
