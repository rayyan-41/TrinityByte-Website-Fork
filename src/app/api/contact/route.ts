/**
 * Contact form delivery. Sends the brief to CONTACT_TO via the Resend REST API.
 *
 * Env (Vercel project settings, and .env.local for `npm run dev`):
 *   RESEND_API_KEY   required — from resend.com/api-keys
 *   CONTACT_TO       optional — defaults to contact@trinitybyte.org
 *   CONTACT_FROM     optional — must be an address on a domain verified in Resend
 *
 * Without RESEND_API_KEY the route returns 503 and the form shows its
 * "email us directly" fallback, so a missing key degrades rather than breaks.
 */

const FIELDS = [
  "name",
  "email",
  "company",
  "projectType",
  "budget",
  "timeline",
  "details",
] as const;

const LABELS: Record<(typeof FIELDS)[number], string> = {
  name: "Name",
  email: "Email",
  company: "Company",
  projectType: "Project type",
  budget: "Budget",
  timeline: "Timeline",
  details: "Details",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "Mail is not configured." }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Public endpoint: re-validate everything the client checked, and cap each
  // field so a scripted post can't stuff megabytes into an email.
  const field = Object.fromEntries(
    FIELDS.map((k) => [k, String(body[k] ?? "").trim().slice(0, 4000)])
  ) as Record<(typeof FIELDS)[number], string>;

  if (
    field.name.length < 2 ||
    !EMAIL.test(field.email) ||
    !field.projectType ||
    field.details.length < 20
  ) {
    return Response.json({ error: "Invalid submission." }, { status: 400 });
  }

  // ponytail: plain text, no HTML template — nothing to escape, nothing to style.
  const text = FIELDS.filter((k) => field[k]).map((k) => `${LABELS[k]}: ${field[k]}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "TrinityByte <contact@trinitybyte.org>",
      to: [process.env.CONTACT_TO ?? "contact@trinitybyte.org"],
      reply_to: field.email,
      subject: `New brief — ${field.name} · ${field.projectType}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend rejected the send:", res.status, await res.text());
    return Response.json({ error: "Could not send." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
