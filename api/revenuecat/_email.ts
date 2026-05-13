type RevenueCatEvent = Record<string, any>;

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  scheduledAt?: string;
  idempotencyKey?: string;
  tags?: Array<{ name: string; value: string }>;
};

const APP_URL = "https://apps.apple.com/us/app/still-meditation/id6757083149";
const SITE_URL = "https://stillmeditation.app";

export function getEvent(body: any): RevenueCatEvent {
  return body?.event || body?.data?.event || body?.payload?.event || body || {};
}

export function getEventType(body: any) {
  const event = getEvent(body);
  return String(event.type || body?.type || body?.event_type || body?.eventType || "").toUpperCase();
}

export function verifyWebhookAuth(req: any) {
  const expected = process.env.REVENUECAT_WEBHOOK_AUTH;
  if (!expected) return true;

  const header = String(req.headers.authorization || req.headers.Authorization || "");
  return header === expected || header === `Bearer ${expected}`;
}

function isEmail(value?: string) {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function attributeValue(event: RevenueCatEvent, key: string) {
  const attributes = event.subscriber_attributes || event.subscriberAttributes || {};
  const value = attributes[key]?.value || attributes[key];
  return typeof value === "string" ? value : undefined;
}

export function getCustomerEmail(body: any) {
  const event = getEvent(body);
  const candidates = [
    body?.email,
    body?.customer_email,
    body?.customerEmail,
    event.email,
    event.customer_email,
    attributeValue(event, "$email"),
    attributeValue(event, "email"),
    attributeValue(event, "Email"),
    event.app_user_id,
    event.original_app_user_id,
    ...(Array.isArray(event.aliases) ? event.aliases : []),
  ];

  return candidates.find((value) => isEmail(String(value))) as string | undefined;
}

export function getCustomerName(body: any) {
  const event = getEvent(body);
  return (
    body?.name ||
    body?.customer_name ||
    event.name ||
    attributeValue(event, "$displayName") ||
    attributeValue(event, "name") ||
    undefined
  );
}

export function getOwnerEmail() {
  return process.env.OWNER_NOTIFICATION_EMAIL || "aki.b@pentridgemedia.com";
}

export function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || "Akinyemi from Still <aki.b@stillapp.us>";
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeTag(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 256) || "unknown";
}

export function eventSummary(body: any) {
  const event = getEvent(body);
  const purchasedAt = event.purchased_at_ms ? new Date(event.purchased_at_ms).toISOString() : "";
  const amount =
    event.price_in_purchased_currency != null && event.currency
      ? `${event.price_in_purchased_currency} ${event.currency}`
      : event.price != null
        ? `$${event.price}`
        : "";

  return {
    id: String(event.id || event.transaction_id || body?.id || "unknown"),
    type: getEventType(body) || "UNKNOWN",
    appUserId: String(event.app_user_id || event.original_app_user_id || "unknown"),
    productId: String(event.product_id || event.new_product_id || "unknown"),
    store: String(event.store || "unknown"),
    environment: String(event.environment || "unknown"),
    amount,
    purchasedAt,
    customerEmail: getCustomerEmail(body) || "",
  };
}

export function stillEmailLayout(title: string, subtitle: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f3efe7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#334155;">
    <div style="max-width:620px;margin:0 auto;padding:36px 18px;">
      <div style="background:#fffdf8;border-radius:22px;overflow:hidden;border:1px solid #e8e1d3;">
        <div style="padding:42px 34px 24px;text-align:center;background:linear-gradient(180deg,rgba(30,58,95,.06),rgba(30,58,95,0));">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#1e3a5f;background:rgba(30,58,95,.08);display:inline-block;padding:8px 14px;border-radius:999px;margin-bottom:20px;">Still</div>
          <h1 style="margin:0;color:#1e3a5f;font-family:Georgia,serif;font-size:34px;line-height:1.15;font-weight:500;">${escapeHtml(title)}</h1>
          <p style="margin:12px auto 0;max-width:420px;color:#60748b;font-family:Georgia,serif;font-size:19px;line-height:1.45;font-style:italic;">${escapeHtml(subtitle)}</p>
        </div>
        <div style="padding:26px 34px 38px;font-size:16px;line-height:1.75;">
          ${bodyHtml}
        </div>
      </div>
      <p style="text-align:center;color:#7b8794;font-size:12px;margin:18px 0 0;">Still - Meditation music as unique as you are.</p>
    </div>
  </body>
</html>`;
}

export function ownerNotificationHtml(summary: ReturnType<typeof eventSummary>, rawBody: any) {
  const rows = [
    ["Event", summary.type],
    ["Customer email", summary.customerEmail || "not provided"],
    ["App user id", summary.appUserId],
    ["Product", summary.productId],
    ["Store", summary.store],
    ["Environment", summary.environment],
    ["Amount", summary.amount || "unknown"],
    ["Purchased at", summary.purchasedAt || "unknown"],
    ["Event id", summary.id],
  ];

  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <h1 style="font-size:24px;">Still RevenueCat event: ${escapeHtml(summary.type)}</h1>
  <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="border:1px solid #e5e7eb;font-weight:700;">${escapeHtml(label)}</td><td style="border:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`,
      )
      .join("")}
  </table>
  <h2 style="font-size:18px;margin-top:24px;">Raw payload</h2>
  <pre style="white-space:pre-wrap;background:#f3f4f6;padding:14px;border-radius:8px;font-size:12px;">${escapeHtml(JSON.stringify(rawBody, null, 2))}</pre>
</body></html>`;
}

export async function sendEmail(input: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey.slice(0, 256) } : {}),
    },
    body: JSON.stringify({
      from: getFromEmail(),
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      scheduledAt: input.scheduledAt,
      reply_to: process.env.RESEND_REPLY_TO || "aki.b@stillapp.us",
      tags: input.tags?.map((tag) => ({
        name: sanitizeTag(tag.name),
        value: sanitizeTag(tag.value),
      })),
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Resend failed: ${response.status} ${JSON.stringify(result)}`);
  }

  return result;
}

export function welcomeEmail(name?: string) {
  const greeting = name ? `Hey ${escapeHtml(name)} -` : "Hey -";
  const html = stillEmailLayout(
    "Welcome to Still",
    "Why I built Still, and why I'm glad you're here.",
    `<p>${greeting} I'm so glad you're here.</p>
    <p>I built Still because I needed it myself. Meditation has been my anchor: the one thing that keeps me grounded when everything else feels like it's spinning.</p>
    <p>Still was born from a simple question: <strong>what if the music I meditate to could reflect how I'm feeling in this moment?</strong></p>
    <p>You describe the mood, feeling, or imagery you want, and create meditation music that's uniquely yours. Not a generic playlist. Something that works for you.</p>
    <div style="background:rgba(30,58,95,.06);border-left:3px solid #1e3a5f;border-radius:0 14px 14px 0;padding:20px 22px;margin:24px 0;">
      <p style="margin:0;color:#1e3a5f;font-family:Georgia,serif;font-size:20px;font-style:italic;">A small act of creation before you settle into stillness.</p>
    </div>
    <p><strong>Try this first:</strong> open the app, head to Create, and make a soundscape that feels like you.</p>
    <p style="margin:28px 0;"><a href="${APP_URL}" style="background:#1e3a5f;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700;">Open Still</a></p>
    <p>Aki<br>Founder, Still</p>
    <p style="font-size:14px;color:#64748b;">P.S. I read every reply. If you have feedback, ideas, or just want to share how your practice is going, I'd genuinely love to hear from you.</p>`,
  );

  return {
    subject: "A note from me to you",
    html,
    text:
      "Welcome to Still. I built Still because I needed it myself. Open the app, head to Create, and make a soundscape that feels like you. - Aki",
  };
}

export function dayTwoEmail() {
  const html = stillEmailLayout(
    "Small moments, big change",
    "Building a practice that actually sticks.",
    `<p>Here's a truth about meditation: <strong>consistency matters more than duration.</strong></p>
    <p>Three minutes of intentional stillness every day will transform you more than a long session once a month. The magic is in showing up.</p>
    <h2 style="color:#1e3a5f;font-size:18px;margin:26px 0 12px;">Tips for building your practice</h2>
    <p><strong>1. Anchor it to something.</strong><br>After coffee. Before opening your laptop. Right after brushing your teeth. The anchor makes it automatic.</p>
    <p><strong>2. Start ridiculously small.</strong><br>Three minutes is enough. Make it so easy you can't say no, even on hard days.</p>
    <p><strong>3. Match music to mood.</strong><br>Anxious morning? Try Nature. Need focus? Piano might be your friend. Let the music meet you where you are.</p>
    <p><strong>4. Celebrate the streak.</strong><br>Still tracks your daily practice. Every moment of stillness counts.</p>
    <div style="background:rgba(30,58,95,.06);padding:20px 22px;border-radius:16px;margin:24px 0;">
      <p style="margin:0;color:#1e3a5f;font-family:Georgia,serif;font-size:20px;font-style:italic;">Today's invitation: open Still and set a 3-minute timer.</p>
    </div>
    <p style="margin:28px 0;"><a href="${APP_URL}" style="background:#1e3a5f;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700;">Start 3 minutes</a></p>
    <p>Aki<br>${SITE_URL}</p>`,
  );

  return {
    subject: "Can you spare 3 minutes today?",
    html,
    text:
      "Consistency matters more than duration. Open Still and set a 3-minute timer today. Every moment of stillness counts. - Aki",
  };
}

export function dayThreeEmail() {
  const html = stillEmailLayout(
    "You're part of this now",
    "Would you share your experience?",
    `<p>You're now part of a small but growing community of people who believe wellness should be personal.</p>
    <p>A quick App Store review helps others discover Still and helps us keep building features that matter. It takes about 30 seconds, and it means everything to us.</p>
    <p style="margin:28px 0;"><a href="${APP_URL}?action=write-review" style="background:#1e3a5f;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700;">Write a Review</a></p>
    <div style="background:rgba(30,58,95,.06);padding:20px 22px;border-radius:16px;margin:24px 0;">
      <p style="margin:0;color:#1e3a5f;font-family:Georgia,serif;font-size:20px;font-style:italic;">Your review could help someone find their calm.</p>
    </div>
    <p>Prefer to share feedback directly? Just reply to this email. We read every message.</p>
    <p>With gratitude,<br>Aki</p>
    <p style="font-size:14px;color:#64748b;">P.S. This is the last onboarding email. From here on, we'll only reach out occasionally with updates or tips.</p>`,
  );

  return {
    subject: "You're part of this now",
    html,
    text:
      "Would you share your experience? A quick App Store review helps others discover Still. You can also reply directly with feedback. - Aki",
  };
}

export function cancellationEmail() {
  const html = stillEmailLayout(
    "Are you sure you want to leave Still?",
    "Your calm is still here if you want it.",
    `<p>I saw that your Still subscription was cancelled.</p>
    <p>If that was intentional, no hard feelings. I appreciate you trying Still, and I hope it gave you even a few useful moments of calm.</p>
    <p>If it was accidental, or if you're still deciding, you can reopen Still or manage your App Store subscriptions to keep your access active.</p>
    <p style="margin:28px 0;"><a href="${APP_URL}" style="background:#1e3a5f;color:#fff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:700;">Open Still</a></p>
    <p>If something didn't work for you, reply and tell me. I read every response, and your feedback directly shapes what we build next.</p>
    <p>Aki<br>Founder, Still</p>`,
  );

  return {
    subject: "Are you sure you want to leave Still?",
    html,
    text:
      "I saw that your Still subscription was cancelled. If it was accidental, you can reopen Still or manage your App Store subscriptions. If something didn't work, reply and tell me. - Aki",
  };
}
