"use client";

import { FormEvent, useRef, useState } from "react";
import { site } from "@/data/site";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

/**
 * Posts the brief to src/app/api/contact/route.ts, which mails it on via Resend.
 * Validation here is for the visitor; the route re-validates the same rules
 * because it is a public endpoint. A missing RESEND_API_KEY makes the route
 * return 503, which surfaces as the "error" state below.
 */
const ENDPOINT = "/api/contact";

const PROJECT_TYPES = [
  "Custom Software",
  "Web Development",
  "Mobile App",
  "UI/UX Design",
  "AI & Automation",
  "Other",
];

const BUDGETS = [
  "Not sure yet",
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
];

const TIMELINES = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Exploring options"];

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "submitting" | "ok" | "error";

const fieldBase =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-ivory placeholder:text-ivory/35 transition-colors duration-300 focus:border-gold focus:outline-none";

const selectExtra = "appearance-none pr-11 cursor-pointer";

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 h-2.5 w-3 -translate-y-1/2 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 1.5 6 6.5 11 1.5" />
    </svg>
  );
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const projectType = String(data.get("projectType") ?? "");
    const details = String(data.get("details") ?? "").trim();

    if (name.length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = "Enter a valid email address.";
    if (!projectType) next.projectType = "Choose the type of project.";
    if (details.length < 20) next.details = "A little more detail helps — 20 characters minimum.";
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const err = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} role="alert" className="mt-2 text-[13px] text-[#e0a3a3]">
        {errors[key]}
      </p>
    ) : null;

  const borderFor = (key: string) => (errors[key] ? "border-[#a35b5b]" : "border-line-dark");

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="w-full">
      <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label-mono block text-muted-dark">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`mt-3 ${fieldBase} ${borderFor("name")}`}
          />
          {err("name")}
        </div>

        <div>
          <label htmlFor="email" className="label-mono block text-muted-dark">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`mt-3 ${fieldBase} ${borderFor("email")}`}
          />
          {err("email")}
        </div>

        <div>
          <label htmlFor="company" className="label-mono block text-muted-dark">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Company or project name"
            className={`mt-3 ${fieldBase} border-line-dark`}
          />
        </div>

        <div>
          <label htmlFor="projectType" className="label-mono block text-muted-dark">
            Project type *
          </label>
          <div className="relative mt-3">
            <select
              id="projectType"
              name="projectType"
              defaultValue=""
              aria-invalid={!!errors.projectType}
              aria-describedby={errors.projectType ? "projectType-error" : undefined}
              className={`${fieldBase} ${borderFor("projectType")} ${selectExtra}`}
            >
              <option value="" disabled className="bg-[#0d0d0f]">
                Select a service
              </option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t} className="bg-[#0d0d0f]">
                  {t}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
          {err("projectType")}
        </div>

        <div>
          <label htmlFor="budget" className="label-mono block text-muted-dark">
            Estimated budget
          </label>
          <div className="relative mt-3">
            <select
              id="budget"
              name="budget"
              defaultValue=""
              className={`${fieldBase} border-line-dark ${selectExtra}`}
            >
              <option value="" disabled className="bg-[#0d0d0f]">
                Select a range
              </option>
              {BUDGETS.map((b) => (
                <option key={b} value={b} className="bg-[#0d0d0f]">
                  {b}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        <div>
          <label htmlFor="timeline" className="label-mono block text-muted-dark">
            Timeline
          </label>
          <div className="relative mt-3">
            <select
              id="timeline"
              name="timeline"
              defaultValue=""
              className={`${fieldBase} border-line-dark ${selectExtra}`}
            >
              <option value="" disabled className="bg-[#0d0d0f]">
                Select a timeline
              </option>
              {TIMELINES.map((t) => (
                <option key={t} value={t} className="bg-[#0d0d0f]">
                  {t}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="details" className="label-mono block text-muted-dark">
            Project details *
          </label>
          <textarea
            id="details"
            name="details"
            rows={6}
            placeholder="What are you building, who is it for, and what does success look like?"
            aria-invalid={!!errors.details}
            aria-describedby={errors.details ? "details-error" : undefined}
            className={`mt-3 resize-y ${fieldBase} ${borderFor("details")}`}
          />
          {err("details")}
        </div>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-5">
        <LiquidMetalButton
          type="submit"
          disabled={status === "submitting"}
          size="lg"
        >
          {status === "submitting" ? "Sending…" : "Send Project Brief"}
          <svg
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
          </svg>
        </LiquidMetalButton>

        <p className="text-[13px] text-muted-dark">
          Or email us directly at{" "}
          <a href={`mailto:${site.email}`} className="link-underline text-ivory">
            {site.email}
          </a>
        </p>
      </div>

      {/* status region */}
      <div aria-live="polite" className="mt-6">
        {status === "ok" && (
          <div className="rounded-xl border border-gold/35 bg-gold/[0.07] px-5 py-4">
            <p className="label-mono text-gold">Brief received</p>
            <p className="mt-2 text-[14px] text-ivory/80">
              Thanks — we&rsquo;ll be in touch shortly.
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="rounded-xl border border-[#a35b5b] bg-[#a35b5b]/10 px-5 py-4">
            <p className="label-mono text-[#e0a3a3]">Something went wrong</p>
            <p className="mt-2 text-[14px] text-ivory/80">
              Your brief didn&rsquo;t send. Please email{" "}
              <a href={`mailto:${site.email}`} className="link-underline text-ivory">
                {site.email}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
