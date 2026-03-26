import type { Express } from "express";
import { createServer, type Server } from "http";
import { createElement } from "react";
import { render } from "@react-email/components";
import { resend, FROM_EMAIL } from "./lib/resend";
import WaitlistConfirmation from "./emails/waitlist-confirmation";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // POST /api/waitlist
  // Stores the signup and sends a confirmation email via Resend.
  app.post("/api/waitlist", async (req, res) => {
    const { firstName, lastName, email } = req.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
    };

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const html = await render(
      createElement(WaitlistConfirmation, { firstName: firstName ?? undefined })
    );

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "You're on the Still waitlist ✨",
      html,
    });

    if (error) {
      console.error("[resend] waitlist confirmation failed:", error);
      return res.status(500).json({ error: "Failed to send confirmation email" });
    }

    return res.json({ success: true });
  });

  // POST /api/webhooks/revenuecat
  // Handles RevenueCat purchase events.
  // Configure in RevenueCat: Dashboard → Integrations → Webhooks → add this URL.
  app.post("/api/webhooks/revenuecat", async (req, res) => {
    const { event } = req.body as {
      event?: {
        type?: string;
        app_user_id?: string;
        subscriber_attributes?: Record<string, { value: string }>;
      };
    };

    if (!event?.type) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    if (event.type === "INITIAL_PURCHASE" || event.type === "NON_RENEWING_PURCHASE") {
      // RevenueCat includes $email if set via Purchases.shared.attribution.setEmail()
      const email = event.subscriber_attributes?.["$email"]?.value;

      if (email) {
        const displayName = event.subscriber_attributes?.["$displayName"]?.value;
        const firstName = displayName?.split(" ")[0];

        const html = await render(
          createElement(WaitlistConfirmation, { firstName })
        );

        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Welcome to Still 🧘",
          html,
          // TODO: swap in full welcome sequence HTML once provided by board
        });

        if (error) {
          console.error("[resend] welcome email failed:", error);
        }
      }
    }

    return res.json({ received: true });
  });

  return httpServer;
}
