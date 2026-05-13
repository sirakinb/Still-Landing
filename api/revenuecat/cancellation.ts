import {
  cancellationEmail,
  eventSummary,
  getCustomerEmail,
  getEventType,
  getOwnerEmail,
  ownerNotificationHtml,
  sendEmail,
  verifyWebhookAuth,
} from "./_email.js";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      webhook: "revenuecat-cancellation",
      expects: "POST RevenueCat CANCELLATION event",
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
  const customerEmail = getCustomerEmail(req.body);
  const results: Record<string, any> = {};

  try {
    if (type !== "CANCELLATION" && type !== "TEST") {
      return res.status(200).json({
        ok: true,
        ignored: true,
        message: `Received ${type || "UNKNOWN"}; cancellation endpoint only handles CANCELLATION.`,
      });
    }

    results.owner = await sendEmail({
      to: getOwnerEmail(),
      subject: type === "TEST" ? "Still RevenueCat cancellation test received" : `Still cancellation: ${summary.productId}`,
      html: ownerNotificationHtml(summary, req.body),
      text: `Still cancellation event\nCustomer: ${summary.customerEmail || "not provided"}\nProduct: ${summary.productId}\nEvent id: ${summary.id}`,
      idempotencyKey: `owner-${summary.id}`,
      tags: [
        { name: "source", value: "revenuecat" },
        { name: "event", value: summary.type },
      ],
    });

    if (!customerEmail) {
      return res.status(200).json({
        ok: true,
        owner_notified: true,
        customer_email_sent: false,
        warning: "No customer email found in RevenueCat payload.",
        results,
      });
    }

    const email = cancellationEmail();
    results.customer = await sendEmail({
      to: customerEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
      idempotencyKey: `customer-${summary.id}-cancellation`,
      tags: [
        { name: "source", value: "revenuecat" },
        { name: "sequence", value: "cancellation" },
      ],
    });

    return res.status(200).json({
      ok: true,
      owner_notified: true,
      customer_email_sent: true,
      customer_email: customerEmail,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    console.error(message);
    return res.status(500).json({ error: message, results });
  }
}
