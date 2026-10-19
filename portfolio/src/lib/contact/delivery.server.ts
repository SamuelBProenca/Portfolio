import type { ContactMessage } from "./validation";
import { ContactServiceError } from "./failure.server";

export type DeliveryConfig = { apiKey: string; from: string; to: string };

export async function deliverContact(
  message: ContactMessage,
  config: DeliveryConfig,
): Promise<boolean> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: message.email,
      subject: `[Portfólio] ${message.subject}`,
      // Plain text deliberately avoids HTML template interpolation.
      text: `Nome: ${message.name}\nE-mail: ${message.email}\n\n${message.message}`,
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const knownCodes = new Set([
      "validation_error",
      "invalid_api_key",
      "missing_api_key",
      "restricted_api_key",
      "rate_limit_exceeded",
      "application_error",
    ]);
    const name =
      body &&
      typeof body === "object" &&
      "name" in body &&
      typeof body.name === "string" &&
      knownCodes.has(body.name)
        ? body.name
        : undefined;
    throw new ContactServiceError("RESEND_REJECTED", response.status, name);
  }
  const result: unknown = await response.json();
  return Boolean(
    result &&
    typeof result === "object" &&
    "id" in result &&
    typeof result.id === "string" &&
    result.id.length > 0,
  );
}
