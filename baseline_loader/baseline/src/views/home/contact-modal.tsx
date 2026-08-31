"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

import { Spring } from "@/components/animation/springs/spring";
import { Hover } from "@/components/animation/springs/hover";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StackedLines } from "@/components/ui/stacked-lines";
import { useContactModal } from "@/hooks/use-contact-modal";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { apiFetch, ApiClientError } from "@/lib/api-client";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = { name: "", email: "", message: "" };

/**
 * "Book a visit" contact dialog. Opened from any CTA via the `useContactModal`
 * store. Portaled to `document.body`, scroll-locked, spring-animated in/out, and
 * it blurs the page behind it. Posts to the same-origin `/api/contact` endpoint.
 */
export const ContactModal = () => {
  const { isOpen, close } = useContactModal();
  const stop = useScroll((s) => s.stop);
  const start = useScroll((s) => s.start);

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  // Lock smooth scroll while open; reset the form a beat after closing.
  useEffect(() => {
    if (isOpen) {
      stop();
      const id = setTimeout(() => nameRef.current?.focus(), 120);
      return () => clearTimeout(id);
    }
    start();
    const id = setTimeout(() => {
      setForm(EMPTY);
      setStatus("idle");
      setErrorMsg("");
    }, 350);
    return () => clearTimeout(id);
  }, [isOpen, stop, start]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      await apiFetch<{ received: boolean }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof ApiClientError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6 ${
        isOpen ? "" : "pointer-events-none"
      }`}
    >
      {/* Blurred, tinted backdrop — opacity springs in so the blur ramps up smoothly. */}
      <Spring
        tag="div"
        enabled={isOpen}
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={{ tension: 240, friction: 30 }}
        className="absolute inset-0 bg-brand-deep/40 backdrop-blur-md"
        onClick={close}
      />

      {/* Panel */}
      <Spring
        tag="div"
        enabled={isOpen}
        from={{ opacity: 0, y: 28, scale: 0.96 }}
        to={{ opacity: 1, y: 0, scale: 1 }}
        config={{ tension: 240, friction: 26 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative max-h-[92svh] w-full overflow-y-auto rounded-card-lg bg-surface-card p-6 text-ink shadow-2xl shadow-brand-deep/30 sm:max-w-lg sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow>Book a visit</Eyebrow>
            <StackedLines
              tag="h2"
              id="contact-modal-title"
              lines={["Come see", "the courts"]}
              enabled={isOpen}
              stagger={90}
              duration={800}
              className="mt-3 text-4xl font-medium leading-[0.95] tracking-tight sm:text-5xl"
            />
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={close}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-pill bg-surface text-ink outline-none hover:bg-hairline focus-visible:ring-2 focus-visible:ring-brand-light"
          >
            <Hover
              tag="span"
              trigger={closeRef}
              from={{ rotate: 0 }}
              to={{ rotate: 90 }}
              config={{ tension: 300, friction: 18 }}
              className="grid place-items-center"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </Hover>
          </button>
        </div>

        {status === "success" ? (
          <div className="mt-8 rounded-card bg-surface p-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-pill bg-brand text-on-brand">
              <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="mt-4 text-lg font-medium">Request received</p>
            <p className="mt-1 text-sm text-ink-soft">
              Thanks, {form.name.split(" ")[0] || "there"} — our team will be in
              touch to lock in your visit.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-6 inline-flex cursor-pointer items-center rounded-pill bg-ink px-7 py-3 text-sm font-medium uppercase tracking-wide text-on-brand outline-none hover:bg-brand-deep focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4" noValidate>
            <Field label="Full name">
              <input
                ref={nameRef}
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Alex Rivera"
                className={inputClass}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@email.com"
                className={inputClass}
              />
            </Field>
            <Field label="What would you like to play?">
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={set("message")}
                placeholder="I'd love to try a private lesson on the clay courts…"
                className={`${inputClass} resize-none`}
              />
            </Field>

            {status === "error" && (
              <p role="alert" className="text-sm text-brand">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill bg-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-on-brand outline-none hover:bg-brand-deep focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Request a visit"}
            </button>
          </form>
        )}
      </Spring>
    </div>,
    document.body,
  );
};

const inputClass =
  "w-full rounded-xl border border-hairline bg-background px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus-visible:border-brand-light focus-visible:ring-2 focus-visible:ring-brand-light";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
      {label}
    </span>
    {children}
  </label>
);
