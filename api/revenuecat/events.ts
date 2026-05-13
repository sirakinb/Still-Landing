import {
  eventSummary,
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
      webhook: "revenuecat-events",
      expects: "POST RevenueCat renewal/product_change/billing_issue/etc event",
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

  try {
    const result = await sendEmail({
      to: getOwnerEmail(),
      subject: `Still RevenueCat event: ${type || "UNKNOWN"}`,
      html: ownerNotificationHtml(summary, req.body),
      text: `Still RevenueCat event: ${summary.type}\nCustomer: ${summary.customerEmail || "not provided"}\nProduct: ${summary.productId}\nStore: ${summary.store}\nEnvironment: ${summary.environment}\nAmount: ${summary.amount || "unknown"}\nEvent id: ${summary.id}`,
      idempotencyKey: `owner-${summary.id}`,
      tags: [
        { name: "source", value: "revenuecat" },
        { name: "event", value: summary.type },
      ],
    });

    return res.status(200).json({
      ok: true,
      owner_notified: true,
      event_type: summary.type,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook error";
    console.error(message);
    return res.status(500).json({ error: message });
  }
}
