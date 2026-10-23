import { describe, expect, it } from "vitest";
import {
  invalidExampleVariables,
  isSensitivePath,
} from "../../scripts/check-repository-security.mjs";

describe("private repository files", () => {
  it("blocks credentials at the root and in nested or Windows paths", () => {
    for (const path of [
      ".env",
      "portfolio/.env.local",
      "nested/.env.production",
      "nested/.env.local.example",
      "nested/.AWS/credentials",
      "nested\\.ssh\\id_ed25519",
      "private/KEY.PEM",
      "private/tls.key",
      "identity.pfx",
      "identity.p12",
      "signing.jks",
      "wallet.keystore",
      "terraform.tfstate.backup",
      "service-account-production.json",
      "service_account.json",
      "nested/.npmrc",
      "credentials.json",
      ".vercel/project.json",
      ".codex/auth.json",
      ".agents/local.json",
    ])
      expect(isSensitivePath(path), path).toBe(true);
  });

  it("allows abstractions, public assets and the empty environment template", () => {
    for (const path of [
      "portfolio/.env.example",
      "src/lib/credentials.server.ts",
      "src/types/api-key.ts",
      ".github/workflows/ci.yml",
      "docs/SECURITY.md",
      "public/images/portrait.webp",
    ])
      expect(isSensitivePath(path), path).toBe(false);
  });

  it("does not allow an environment template inside a private directory", () => {
    expect(isSensitivePath(".aws/.env.example")).toBe(true);
  });
});

describe("environment templates", () => {
  it("accepts empty secret fields and non-secret example settings", () => {
    expect(
      invalidExampleVariables(
        "RESEND_API_KEY=\nTOKEN=\"\"\nSECRET=''\nCONTACT_TO_EMAIL=contact@example.com\n",
      ),
    ).toEqual([]);
  });

  it("reports variable names without returning their values", () => {
    expect(
      invalidExampleVariables(
        "RESEND_API_KEY=placeholder\nexport DATABASE_URL=placeholder\n# TOKEN=ignored\nPASSWORD='placeholder' # comment",
      ),
    ).toEqual(["RESEND_API_KEY", "DATABASE_URL", "PASSWORD"]);
  });
});
