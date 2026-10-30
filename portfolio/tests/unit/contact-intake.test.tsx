import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactSection from "@/components/contact-section";
import { getProjectIntakeFormUrl } from "@/lib/contact/intake-form";

afterEach(() => vi.unstubAllEnvs());

describe("project intake destination", () => {
  it.each([
    "https://forms.gle/ExampleFormId",
    "https://docs.google.com/forms/d/e/ExampleFormId/viewform?usp=sf_link",
    "https://docs.google.com/forms/d/ExampleFormId/viewform",
  ])("accepts a supported Google responder URL: %s", (value) => {
    expect(getProjectIntakeFormUrl(value)).toBe(value);
  });

  it.each([
    undefined,
    "",
    "not a URL",
    "javascript:alert(1)",
    "http://forms.gle/ExampleFormId",
    "https://forms.gle.evil.example/ExampleFormId",
    "https://evil.example/forms.gle/ExampleFormId",
    "https://user:password@forms.gle/ExampleFormId",
    "https://forms.gle:444/ExampleFormId",
    "https://forms.gle/",
    "https://docs.google.com/forms/d/ExampleFormId/edit",
    "https://docs.google.com/document/d/ExampleFormId/viewform",
  ])("rejects missing, editor or unsafe destinations: %s", (value) => {
    expect(getProjectIntakeFormUrl(value)).toBeNull();
  });

  it("offers only the approved email while no published form exists", () => {
    vi.stubEnv("PROJECT_INTAKE_FORM_URL", "");
    render(<ContactSection />);
    expect(screen.getByRole("link", { name: "Enviar e-mail" })).toHaveAttribute(
      "href",
      "mailto:samuelbrito782@gmail.com",
    );
    expect(screen.queryByRole("link", { name: "Descrever meu projeto" })).not.toBeInTheDocument();
    expect(document.querySelector('a[href*="wa.me"]')).toBeNull();
    expect(screen.queryByText(/98958/)).not.toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("offers the form for projects and a direct email for professional contacts", () => {
    vi.stubEnv("PROJECT_INTAKE_FORM_URL", "https://forms.gle/ExampleFormId");
    render(<ContactSection />);
    const action = screen.getByRole("link", { name: "Descrever meu projeto" });
    expect(action).toHaveAttribute("href", "https://forms.gle/ExampleFormId");
    expect(action).toHaveAttribute("target", "_blank");
    expect(action).toHaveAttribute("rel", "noopener noreferrer");
    expect(action).toHaveAccessibleDescription(/Google Forms.*outra aba/);
    expect(screen.getByText("Recrutamento e outros contatos profissionais")).toBeVisible();
    expect(screen.getByRole("link", { name: "samuelbrito782@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:samuelbrito782@gmail.com",
    );
    expect(document.querySelector('a[href*="wa.me"]')).toBeNull();
  });

  it("keeps email usable if someone configures a Google editor link", () => {
    vi.stubEnv("PROJECT_INTAKE_FORM_URL", "https://docs.google.com/forms/d/ExampleFormId/edit");
    render(<ContactSection />);
    expect(screen.getByRole("link", { name: "Enviar e-mail" })).toHaveAttribute(
      "href",
      "mailto:samuelbrito782@gmail.com",
    );
    expect(screen.queryByRole("link", { name: "Descrever meu projeto" })).not.toBeInTheDocument();
  });
});
