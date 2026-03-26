import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Verified sender — stillapp.us must be verified in Resend dashboard
// Until verified, set FROM_EMAIL=onboarding@resend.dev in env for testing
export const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "Still <aki.b@stillapp.us>";
