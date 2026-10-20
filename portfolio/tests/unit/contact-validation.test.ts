import { describe, expect, it } from "vitest";
import { contactLimits, validateContact } from "@/lib/contact/validation";

const valid = {
  name: "Ana Silva",
  email: "ana@example.com",
  subject: "Novo projeto",
  message: "Vamos conversar sobre um projeto.",
};

describe("shared contact validation", () => {
  it("normalizes accents, line endings and control characters before submission", () => {
    expect(
      validateContact({
        ...valid,
        name: "  Jose\u0301 Silva  ",
        message: "  Primeira linha.\r\nSegunda\u0000 linha.  ",
      }),
    ).toEqual({
      ok: true,
      message: { ...valid, name: "José Silva", message: "Primeira linha.\nSegunda linha." },
    });
  });

  it.each(Object.entries(contactLimits))(
    "accepts the exact %s length limit and rejects excess",
    (field, limit) => {
      const value = field === "email" ? `${"a".repeat(limit - 12)}@example.com` : "a".repeat(limit);
      expect(validateContact({ ...valid, [field]: value }).ok).toBe(true);
      const result = validateContact({ ...valid, [field]: `a${value}` });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.errors).toHaveProperty(field, `Use no máximo ${limit} caracteres.`);
    },
  );

  it.each([null, [], "text", 42])("rejects a non-object payload: %s", (input) => {
    expect(validateContact(input)).toMatchObject({ ok: false, spam: false });
  });

  it.each(["name", "subject", "email"])("rejects header line breaks in %s", (field) => {
    const result = validateContact({
      ...valid,
      [field]: `${valid[field as keyof typeof valid]}\r\nInjected`,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.errors[field as keyof typeof valid]).toBe("Use apenas uma linha neste campo.");
  });

  it("accepts empty honeypots but rejects filled or malformed ones", () => {
    expect(validateContact({ ...valid, website: "  " }).ok).toBe(true);
    for (const website of ["https://spam.example", true, {}]) {
      expect(validateContact({ ...valid, website })).toEqual({ ok: false, errors: {}, spam: true });
    }
  });

  it("reports every invalid field when values have unexpected types", () => {
    const result = validateContact({ name: [], email: null, subject: true, message: 123 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(Object.keys(result.errors)).toEqual(["name", "email", "subject", "message"]);
  });
});
