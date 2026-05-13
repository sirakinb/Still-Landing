import {
  dayThreeEmail,
  dayTwoEmail,
  eventSummary,
  getCustomerEmail,
  getCustomerName,
  getEventType,
  getOwnerEmail,
  ownerNotificationHtml,
  sendEmail,
  verifyWebhookAuth,
  welcomeEmail,
} from "./_email.js";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      webhook: "revenuecat-initial-purchase",
      expects: "POST RevenueCat INITIAL_PURCHASE event",
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyWebhookAuth(req)) {
    return res.status(401).json({ error: "Invalid webhook authorization" });
  }

  const type = getEventType(req.body);
  const summary = eventSummary(req.body);
  const eventId = summary.id;
  const customerEmail = getCustomerEmail(req.body);
  const customerName = getCustomerName(req.body);
  const results: Record<string, any> = {};

  try {
    if (type !== "INITIAL_PURCHASE" && type !== "TEST") {
      return res.status(200).json({
        ok: true,
        ignored: true,
        message: `Received ${type || "UNKNOWN"}; initial purchase endpoint only handles INITIAL_PURCHASE.`,
      });
    }

    const ownerSubject =
      type === "TEST"
        ? "Still RevenueCat test event received"
        : `New Still purchase: ${summary.productId}`;

    results.owner = await sendEmail({
      to: getOwnerEmail(),
      subject: ownerSubject,
      html: ownerNotificationHtml(summary, req.body),
      text: `Still RevenueCat event: ${summary.type}\nCustomer: ${summary.customerEmail || "not provided"}\nProduct: ${summary.productId}\nAmount: ${summary.amount || "unknown"}\nEvent id: ${summary.id}`,
      idempotencyKey: `owner-${eventId}`,
      tags: [
        { name: "source", value: "revenuecat" },
        { name: "event", value: summary.type },
      ],
    });

    if (!customerEmail) {
      return res.status(200).json({
        ok: true,
        owner_notified: true,
        customer_sequence_started: false,
        warning: "No customer email found in RevenueCat payload.",
        results,
      });
    }

    const email1 = welcomeEmail(customerName);
    const email2 = dayTwoEmail();
    const email3 = dayThreeEmail();

    results.email1 = await sendEmail({
      to: customerEmail,
      subject: email1.subject,
      html: email1.html,
      text: email1.text,
      idempotencyKey: `customer-${eventId}-day-1`,
      tags: [
        { name: "source", value: "revenuecat" },
        { name: "sequence", value: "purchase_onboarding" },
        { name: "day", value: "1" },
      ],
    });

    results.email2 = await sendEmail({
      to: customerEmail,
      subject: email2.subject,
      html: email2.html,
      text: email2.text,
      scheduledAt: "in 1 day",
      idempotencyKey: `customer-${eventId}-day-2`,
      tags: [
        { name: "source", value: "revenuecat" },
        { name: "sequence", value: "purchase_onboarding" },
        { name: "day", value: "2" },
      ],
    });

    results.email3 = await sendEmail({
      to: customerEmail,
      subject: email3.subject,
      html: email3.html,
      text: email3.text,
      scheduledAt: "in 2 days",
      idempotencyKey: `customer-${eventId}-day-3`,
      tags: [
        { name: "source", value: "revenuecat" },
        { name: "sequence", value: "purchase_onboarding" },
        { name: "day", value: "3" },
      ],
    });

    return res.status(200).json({
      ok: true,
      owner_notified: true,
      customer_sequence_started: true,
      customer_email: customerEmail,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    console.error(message);
    return res.status(500).json({ error: message, results });
  }
}
