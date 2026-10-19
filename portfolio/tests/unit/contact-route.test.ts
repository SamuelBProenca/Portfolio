import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const valid = {
  name: "Ana Silva",
  email: "ana@example.com",
  subject: "Um projeto novo",
  message: "Gostaria de conversar sobre um projeto.",
  website: "",
};
const send = vi.fn();

beforeEach(() => {
  vi.resetModules();
  send.mockReset();
  vi.stubGlobal("fetch", send);
  vi.stubEnv("RESEND_API_KEY", "re_unit_test_secret");
  vi.stubEnv("CONTACT_FROM_EMAIL", "portfolio@example.com");
  vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("CONTACT_RATE_LIMIT_MODE", "memory");
  vi.stubEnv("VERCEL", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

async function submit(body: unknown = valid, headers: Record<string, string> = {}) {
  const { POST } = await import("@/app/api/contact/route");
  return POST(
    new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body),
    }),
  );
}

describe("contact endpoint", () => {
  it("validates all required fields before contacting the provider", async () => {
    const response = await submit({
      name: "",
      email: "not-an-email",
      subject: "",
      message: "short",
    });
    expect(response.status).toBe(400);
    expect(Object.keys((await response.json()).fields)).toHaveLength(4);
    expect(send).not.toHaveBeenCalled();
  });
  it("rejects cross-site posts, unexpected content types and honeypots", async () => {
    expect((await submit(valid, { origin: "https://attacker.example" })).status).toBe(403);
    expect((await submit(valid, { "content-type": "text/plain" })).status).toBe(415);
    expect((await submit({ ...valid, website: "https://spam.example" })).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });
  it("rejects oversized bodies even without a content-length header", async () => {
    expect((await submit({ ...valid, message: "a".repeat(17_000) })).status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON and header line breaks", async () => {
    const { POST } = await import("@/app/api/contact/route");
    expect(
      (
        await POST(
          new Request("http://localhost:3000/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{",
          }),
        )
      ).status,
    ).toBe(400);
    expect((await submit({ ...valid, subject: "Hello\r\nBcc: somebody@example.com" })).status).toBe(
      400,
    );
    expect(send).not.toHaveBeenCalled();
  });
  it("returns unavailable when provider configuration is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await submit()).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("[contact]", { code: "CONTACT_CONFIGURATION" });
  });
  it("enforces the field length limits before contacting the provider", async () => {
    for (const [field, length] of [
      ["name", 101],
      ["subject", 161],
      ["message", 5001],
    ] as const) {
      const response = await submit({ ...valid, [field]: "a".repeat(length) });
      expect(response.status).toBe(400);
      expect((await response.json()).fields[field]).toContain("máximo");
    }
    expect(send).not.toHaveBeenCalled();
  });
  it("returns success only after a provider ID and uses visitor email as reply_to", async () => {
    send.mockResolvedValue(Response.json({ id: "accepted-message" }));
    const response = await submit({
      ...valid,
      message: "<script>alert('test')</script> is plain text.",
    });
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ message: expect.stringMatching(/aceita para envio/) });
    const [url, options] = send.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options.headers.Authorization).toBe("Bearer re_unit_test_secret");
    const payload = JSON.parse(options.body);
    expect(payload).toMatchObject({
      from: "portfolio@example.com",
      to: ["owner@example.com"],
      reply_to: "ana@example.com",
    });
    expect(payload.html).toBeUndefined();
    expect(payload.text).toContain("<script>");
    expect(JSON.stringify(responseBody)).not.toContain("re_unit_test_secret");
  });
  it.each(["rejected", "missing-id", "network"])(
    "does not claim success when delivery is %s",
    async (failure) => {
      if (failure === "network") send.mockRejectedValue(new Error("private provider details"));
      else
        send.mockResolvedValue(
          Response.json(failure === "rejected" ? { error: "private provider details" } : {}, {
            status: failure === "rejected" ? 422 : 200,
          }),
        );
      const response = await submit();
      expect(response.status).toBe(502);
      const body = await response.json();
      expect(body.message).toBeUndefined();
      expect(body.error).not.toContain("private provider details");
      const logs = JSON.stringify(vi.mocked(console.error).mock.calls);
      expect(logs).not.toContain("private provider details");
      expect(logs).not.toContain(valid.email);
      expect(logs).not.toContain("re_unit_test_secret");
    },
  );
  it("limits attempts before a fourth provider request", async () => {
    send.mockImplementation(async () => Response.json({ id: "accepted-message" }));
    for (let index = 0; index < 3; index++) expect((await submit()).status).toBe(200);
    const response = await submit();
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(send).toHaveBeenCalledTimes(3);
  });
  it("requires shared rate limiting in production unless memory mode is explicitly selected", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTACT_RATE_LIMIT_MODE", "");
    expect((await submit()).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });
  it("rejects memory quotas on Vercel even when explicitly selected", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("CONTACT_RATE_LIMIT_MODE", "memory");
    expect((await submit()).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "[contact]",
      expect.objectContaining({ code: "RATE_LIMIT_NOT_CONFIGURED" }),
    );
  });
  it("records a safe provider diagnostic without logging its raw error", async () => {
    send.mockResolvedValue(
      Response.json(
        { name: "validation_error", message: "private sender/address details" },
        { status: 403 },
      ),
    );
    expect((await submit()).status).toBe(502);
    expect(console.error).toHaveBeenCalledWith(
      "[contact]",
      expect.objectContaining({
        code: "RESEND_REJECTED",
        providerStatus: 403,
        providerCode: "validation_error",
      }),
    );
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain(
      "private sender/address details",
    );
  });
  it("enforces a global quota even when senders rotate email addresses", async () => {
    send.mockImplementation(async () => Response.json({ id: "accepted-message" }));
    for (let index = 0; index < 30; index++)
      expect((await submit({ ...valid, email: `sender${index}@example.com` })).status).toBe(200);
    expect((await submit({ ...valid, email: "another@example.com" })).status).toBe(429);
    expect(send).toHaveBeenCalledTimes(30);
  });
  it("uses shared quotas without transmitting raw visitor email to Redis", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "redis-unit-token");
    send
      .mockResolvedValueOnce(Response.json({ result: [1, 600000] }))
      .mockResolvedValueOnce(Response.json({ result: [4, 599000] }));
    const response = await submit();
    expect(response.status).toBe(429);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls.every(([url]) => url === "https://redis.example.test")).toBe(true);
    expect(JSON.stringify(send.mock.calls)).not.toContain(valid.email);
  });
  it("fails closed when the shared quota store is unavailable", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.test");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "redis-unit-token");
    send.mockResolvedValue(Response.json({ error: "private redis error" }, { status: 500 }));
    expect((await submit()).status).toBe(503);
    expect(send).toHaveBeenCalledTimes(1);
  });
});
