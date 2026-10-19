export const contactLimits = { name: 100, email: 254, subject: 160, message: 5000 } as const;
export type ContactField = keyof typeof contactLimits;
export type ContactMessage = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactResult =
  { ok: true; message: ContactMessage } | { ok: false; errors: ContactErrors; spam: boolean };

export function isEmail(value: string): boolean {
  return value.length <= contactLimits.email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

export function validateContact(input: unknown): ContactResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { name: "Informe seu nome completo." }, spam: false };
  }
  const values = input as Record<string, unknown>;
  if (
    values.website !== undefined &&
    (typeof values.website !== "string" || values.website.trim())
  ) {
    return { ok: false, errors: {}, spam: true };
  }
  const errors: ContactErrors = {};
  const message = {} as ContactMessage;
  for (const field of Object.keys(contactLimits) as ContactField[]) {
    const raw = typeof values[field] === "string" ? values[field] : "";
    const value = raw
      .normalize("NFC")
      .replace(/\r\n?/g, "\n")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim();
    message[field] = value;
    const min = field === "message" ? 10 : field === "email" ? 3 : 2;
    if (value.length < min)
      errors[field] =
        field === "message"
          ? "Escreva uma mensagem com pelo menos 10 caracteres."
          : "Preencha este campo.";
    else if (value.length > contactLimits[field])
      errors[field] = `Use no máximo ${contactLimits[field]} caracteres.`;
    else if (field !== "message" && /[\r\n]/.test(raw))
      errors[field] = "Use apenas uma linha neste campo.";
  }
  if (!errors.email && !isEmail(message.email))
    errors.email = "Informe um endereço de e-mail válido.";
  return Object.keys(errors).length ? { ok: false, errors, spam: false } : { ok: true, message };
}
