import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactForm from "@/components/contact-form";

afterEach(() => {
  vi.unstubAllGlobals();
});
async function fill() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nome completo"), "Ana Silva");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Assunto"), "Novo projeto");
  await user.type(screen.getByLabelText("Mensagem"), "Vamos conversar sobre um novo projeto.");
  return user;
}
describe("contact form", () => {
  it("reports invalid fields and focuses the first without sending", async () => {
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    render(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
    expect(screen.getByLabelText("Nome completo")).toHaveFocus();
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("E-mail")).toHaveAccessibleDescription("Preencha este campo.");
    expect(screen.getByRole("alert")).toHaveTextContent("Revise os campos");
    expect(send).not.toHaveBeenCalled();
  });
  it("preserves the message and shows safe failure feedback after provider rejection", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ error: "Não foi possível enviar agora." }, { status: 502 }),
        ),
    );
    render(<ContactForm />);
    const user = await fill();
    await user.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível enviar agora.");
    expect(screen.getByLabelText("Mensagem")).toHaveValue("Vamos conversar sobre um novo projeto.");
    expect(screen.queryByText(/aceita para envio/)).not.toBeInTheDocument();
  });
  it("shows a loading state, avoids duplicate sends and resets only after acceptance", async () => {
    let finish!: (value: Response) => void;
    const send = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          finish = resolve;
        }),
    );
    vi.stubGlobal("fetch", send);
    render(<ContactForm />);
    const user = await fill();
    await user.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
    const button = screen.getByRole("button", { name: /Enviando mensagem/ });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(send).toHaveBeenCalledTimes(1);
    finish(Response.json({ message: "Mensagem aceita para envio." }));
    expect(await screen.findByText("Mensagem aceita para envio.")).toBeVisible();
    expect(screen.getByLabelText("Nome completo")).toHaveValue("");
    expect(screen.getByLabelText("Mensagem")).toHaveValue("");
  });
  it("recovers from network failure and leaves the input intact", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    render(<ContactForm />);
    const user = await fill();
    await user.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Confira sua conexão/);
    expect(screen.getByRole("button", { name: /Enviar mensagem/ })).toBeEnabled();
    expect(screen.getByLabelText("E-mail")).toHaveValue("ana@example.com");
  });

  it("associates server field errors, restores focus and allows a successful retry", async () => {
    const send = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(
          {
            error: "Revise o e-mail informado.",
            fields: { email: "Use um endereço de e-mail válido.", unexpected: "Ignored" },
          },
          { status: 400 },
        ),
      )
      .mockResolvedValueOnce(Response.json({ message: "Mensagem aceita para envio." }));
    vi.stubGlobal("fetch", send);
    render(<ContactForm />);
    const user = await fill();
    await user.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
    const email = screen.getByLabelText("E-mail");
    expect(await screen.findByRole("alert")).toHaveTextContent("Revise o e-mail informado.");
    expect(email).toBeEnabled();
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Use um endereço de e-mail válido.");
    expect(screen.getByLabelText("Mensagem")).toHaveValue("Vamos conversar sobre um novo projeto.");

    await user.clear(email);
    await user.type(email, "ana.silva@example.com");
    await user.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
    expect(await screen.findByRole("status")).toHaveTextContent("Mensagem aceita para envio.");
    expect(email).toHaveAttribute("aria-invalid", "false");
    expect(email).not.toHaveAttribute("aria-describedby");
    expect(send).toHaveBeenCalledTimes(2);
    expect(JSON.parse(send.mock.calls[1][1].body).email).toBe("ana.silva@example.com");
  });

  it.each(["null", "not-json", "{}"])(
    "keeps the form recoverable when the response is %s",
    async (body) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body, { status: 200 })));
      render(<ContactForm />);
      const user = await fill();
      await user.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
      expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível enviar.");
      expect(screen.getByRole("form")).toHaveAttribute("aria-busy", "false");
      expect(screen.getByRole("button", { name: /Enviar mensagem/ })).toBeEnabled();
      expect(screen.getByLabelText("Mensagem")).toHaveValue(
        "Vamos conversar sobre um novo projeto.",
      );
    },
  );

  it("recovers from a request timeout without clearing the draft", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Timed out", "TimeoutError")),
    );
    render(<ContactForm />);
    const user = await fill();
    await user.click(screen.getByRole("button", { name: /Enviar mensagem/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Confira sua conexão");
    expect(screen.getByRole("form")).toHaveAttribute("aria-busy", "false");
    expect(screen.getByLabelText("Mensagem")).toHaveValue("Vamos conversar sobre um novo projeto.");
  });
});
