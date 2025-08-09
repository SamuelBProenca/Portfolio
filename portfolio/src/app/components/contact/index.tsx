"use client";
import { useEffect, useState } from "react";

export default function Contact() {
  const [locale, setLocale] = useState<"pt" | "en">("en");
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    tags: [] as string[],
  });

  useEffect(() => {
    const lang = navigator.language || "en";
    setLocale(lang.startsWith("pt") ? "pt" : "en");
  }, []);

  const t = {
    title: locale === "pt" ? "Entre em contato" : "Get in touch",
    subtitle:
      locale === "pt"
        ? "Ou envie um email diretamente para contato@samuelproenca.com"
        : "Or email me directly at contato@samuelproenca.com",
    labels: {
      name: locale === "pt" ? "Nome *" : "Name *",
      email: locale === "pt" ? "Email *" : "Email *",
      company: locale === "pt" ? "Empresa" : "Company",
      subject: locale === "pt" ? "Assunto *" : "Subject *",
      message: locale === "pt" ? "Mensagem *" : "Message *",
      tags: locale === "pt" ? "Tags (opcional)" : "Tags (optional)",
      placeholderName:
        locale === "pt" ? "Seu nome completo" : "Your full name",
      placeholderEmail:
        locale === "pt" ? "email@exemplo.com" : "email@example.com",
      placeholderCompany:
        locale === "pt"
          ? "Nome da empresa (opcional)"
          : "Company name (optional)",
      placeholderSubject:
        locale === "pt"
          ? "Sobre o que deseja falar?"
          : "What do you want to talk about?",
      placeholderMessage:
        locale === "pt"
          ? "Escreva sua mensagem aqui..."
          : "Write your message here...",
      placeholderTags:
        locale === "pt"
          ? "Pressione Enter ou , para adicionar"
          : "Press Enter or , to add",
      send: locale === "pt" ? "Enviar" : "Send",
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ","].includes(e.key) && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("company", formData.company);
    data.append("subject", formData.subject);
    data.append("message", formData.message);
    formData.tags.forEach((tag) => data.append("tags[]", tag));

    const response = await fetch(
      "https://formsubmit.co/contato@samuelproenca.com",
      {
        method: "POST",
        body: data,
      }
    );

    if (response.ok) {
      alert(
        locale === "pt"
          ? "Email enviado com sucesso!"
          : "Email sent successfully!"
      );
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        tags: [],
      });
      setTagInput("");
    } else {
      alert(locale === "pt" ? "Erro ao enviar email." : "Error sending email.");
    }
  };

  return (
    <section
      id="contact"
      className="mb-20 mt-40 px-6 text-neutral-900 dark:text-neutral-100"
    >
      <h3 className="text-3xl font-semibold mb-2">{t.title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">{t.subtitle}</p>

      <form action="https://formsubmit.co/contato@samuelproenca.com" method="POST"
        onSubmit={handleSubmit}
        className="
          max-w-7xl mx-auto
          bg-white/30 dark:bg-black/40
          backdrop-blur-md
          border border-white/30 dark:border-white/20
          rounded-xl
          shadow-lg
          p-8
          grid
          gap-6
          sm:grid-cols-1
          md:grid-cols-2
          transition-colors
        "
      >
        {[
          {
            name: "name",
            label: t.labels.name,
            placeholder: t.labels.placeholderName,
            required: true,
          },
          {
            name: "email",
            label: t.labels.email,
            placeholder: t.labels.placeholderEmail,
            required: true,
            type: "email",
          },
          {
            name: "company",
            label: t.labels.company,
            placeholder: t.labels.placeholderCompany,
          },
          {
            name: "subject",
            label: t.labels.subject,
            placeholder: t.labels.placeholderSubject,
            required: true,
          },
        ].map(({ name, label, placeholder, required, type }) => (
          <label key={name} className="block">
            <span className="block mb-2 font-medium">{label}</span>
            <input
              type={type ?? "text"}
              name={name}
              value={formData[name as keyof typeof formData] as string}
              onChange={handleChange}
              required={required}
              placeholder={placeholder}
              className="
                w-full
                px-4 py-3
                rounded-lg
                border border-white/40 dark:border-white/30
                bg-white/70 dark:bg-black/70
                text-neutral-900 dark:text-neutral-100
                focus:outline-none focus:ring-2 focus:ring-cyan-400
                placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                transition
              "
            />
          </label>
        ))}

        <label className="block md:col-span-2">
          <span className="block mb-2 font-medium">{t.labels.message}</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            placeholder={t.labels.placeholderMessage}
            className="
              w-full
              px-4 py-3
              rounded-lg
              border border-white/40 dark:border-white/30
              bg-white/70 dark:bg-black/70
              text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-cyan-400
              placeholder:text-neutral-500 dark:placeholder:text-neutral-400
              transition
            "
          />
        </label>

        <div className="md:col-span-2">
          <span className="block mb-2 font-medium">{t.labels.tags}</span>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={t.labels.placeholderTags}
            className="
              w-full
              px-4 py-3
              rounded-lg
              border border-white/40 dark:border-white/30
              bg-white/70 dark:bg-black/70
              text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-cyan-400
              placeholder:text-neutral-500 dark:placeholder:text-neutral-400
              transition
            "
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleRemoveTag(tag)}
                className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-cyan-400 transition select-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleRemoveTag(tag);
                }}
              >
                {tag} ✕
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="
            bg-cyan-500
            text-neutral-950
            font-semibold
            px-6 py-3
            rounded-xl
            hover:bg-cyan-400
            transition
            col-span-full
            mt-6
            cursor-pointer
            shadow-md
            active:scale-95
            focus:outline-none focus:ring-4 focus:ring-cyan-400
          "
        >
          {t.labels.send}
        </button>
      </form>

    </section>
  );
}
