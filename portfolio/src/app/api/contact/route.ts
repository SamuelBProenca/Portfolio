import { validateContact, isEmail } from "@/lib/contact/validation";
import { deliverContact } from "@/lib/contact/delivery.server";
import { limitContact } from "@/lib/contact/rate-limit.server";
import { reportContactFailure } from "@/lib/contact/failure.server";

export const runtime = "nodejs";
export const maxDuration = 30;
const maxBody = 16_384;
const unavailable =
  "Não foi possível enviar agora. Tente novamente mais tarde ou use o e-mail alternativo.";

function reply(body: object, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBody) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBody) {
      await reader.cancel();
      throw new RangeError();
    }
    chunks.push(value);
  }
  const data = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Cross-site browser form posts are rejected; non-browser clients still face
  // validation, a honeypot and server-side quotas.
  if (
    (origin && origin !== new URL(request.url).origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return reply({ error: "Origem não permitida." }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    return reply({ error: "Envie os dados em JSON." }, 415);
  let input: unknown;
  try {
    input = await readBody(request);
  } catch (error) {
    return reply(
      {
        error:
          error instanceof RangeError
            ? "Mensagem muito grande."
            : "Não foi possível ler os dados do formulário.",
      },
      error instanceof RangeError ? 413 : 400,
    );
  }
  const result = validateContact(input);
  if (!result.ok)
    return reply(
      {
        error: result.spam
          ? "Não foi possível enviar este formulário."
          : "Revise os campos indicados.",
        fields: result.errors,
      },
      400,
    );

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  // Plain addresses only: sender display names and user-supplied header values
  // are deliberately excluded. The sender domain must be verified in Resend.
  if (!apiKey || !from || !to || !isEmail(from) || !isEmail(to)) {
    reportContactFailure("CONTACT_CONFIGURATION");
    return reply({ error: unavailable }, 503);
  }
  try {
    const limit = await limitContact(result.message.email);
    if (!limit.allowed)
      return reply(
        { error: "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente." },
        429,
        { "Retry-After": String(limit.retryAfter) },
      );
  } catch (error) {
    reportContactFailure("RATE_LIMIT_UNAVAILABLE", error);
    return reply({ error: unavailable }, 503);
  }
  try {
    if (!(await deliverContact(result.message, { apiKey, from, to }))) {
      reportContactFailure("RESEND_INVALID_RESPONSE");
      return reply({ error: unavailable }, 502);
    }
    return reply({ message: "Mensagem aceita para envio. Obrigado pelo contato!" }, 200);
  } catch (error) {
    reportContactFailure("RESEND_NETWORK_FAILURE", error);
    return reply({ error: unavailable }, 502);
  }
}
