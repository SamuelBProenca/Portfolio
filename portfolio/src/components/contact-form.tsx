"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  contactLimits,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact/validation";

const fields = [
  { name: "name", label: "Nome completo", type: "text", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "subject", label: "Assunto", type: "text", autoComplete: "off" },
] as const;

export default function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [phase, setPhase] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Server validation arrives while inputs are disabled. Focus after React re-enables them.
  useEffect(() => {
    const field = Object.keys(errors)[0];
    if (phase === "error" && field) {
      (formRef.current?.elements.namedItem(field) as HTMLElement | null)?.focus();
    }
  }, [errors, phase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = validateContact(data);
    setFeedback("");
    if (!result.ok) {
      setErrors(result.errors);
      setPhase("error");
      setFeedback("Revise os campos indicados antes de enviar.");
      return;
    }
    setErrors({});
    setPhase("sending");
    submitting.current = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.message, website: data.website }),
        signal: AbortSignal.timeout(25_000),
      });
      const payload: unknown = await response.json();
      const body = (payload && typeof payload === "object" ? payload : {}) as {
        message?: unknown;
        error?: unknown;
        fields?: Partial<Record<ContactField, unknown>>;
      };
      if (!response.ok || typeof body.message !== "string") {
        const invalid: ContactErrors = {};
        for (const field of [...fields.map((entry) => entry.name), "message"] as ContactField[]) {
          if (typeof body.fields?.[field] === "string") invalid[field] = body.fields[field];
        }
        setErrors(invalid);
        throw new Error(
          typeof body.error === "string"
            ? body.error
            : "Não foi possível enviar. Tente novamente mais tarde.",
        );
      }
      form.reset();
      setPhase("success");
      setFeedback(body.message);
    } catch (error) {
      setPhase("error");
      setFeedback(
        error instanceof Error && error.name === "Error"
          ? error.message
          : "Não foi possível enviar. Confira sua conexão e tente novamente.",
      );
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form
      ref={formRef}
      method="post"
      action="/api/contact"
      className="contact-form"
      aria-label="Formulário de contato"
      onSubmit={submit}
      noValidate
      aria-busy={phase === "sending"}
    >
      <p className="contact-form__intro">
        Preencha seus dados e descreva o projeto ou a oportunidade. Todos os campos são
        obrigatórios.
      </p>
      <div className="contact-form__fields">
        {fields.map(({ name, label, type, autoComplete }) => (
          <div className={`contact-field contact-field--${name}`} key={name}>
            <label htmlFor={`contact-${name}`}>{label}</label>
            <input
              id={`contact-${name}`}
              name={name}
              type={type}
              autoComplete={autoComplete}
              required
              disabled={phase === "sending"}
              maxLength={contactLimits[name]}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
            />
            {errors[name] && (
              <span className="contact-field__error" id={`contact-${name}-error`}>
                {errors[name]}
              </span>
            )}
          </div>
        ))}
        <div className="contact-field contact-field--message">
          <label htmlFor="contact-message">Mensagem</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            disabled={phase === "sending"}
            minLength={10}
            maxLength={contactLimits.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <span className="contact-field__error" id="contact-message-error">
              {errors.message}
            </span>
          )}
        </div>
      </div>
      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="contact-form__submit" type="submit" disabled={phase === "sending"}>
        {phase === "sending" ? "Enviando mensagem…" : "Enviar mensagem"}
        <span aria-hidden="true">↗</span>
      </button>
      <div
        className="contact-form__feedback"
        role={phase === "error" ? "alert" : "status"}
        aria-live={phase === "error" ? "assertive" : "polite"}
      >
        {feedback || (phase === "sending" ? "Aguarde a confirmação do envio." : "")}
      </div>
    </form>
  );
}
