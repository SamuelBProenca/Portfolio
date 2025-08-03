"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  const response = await fetch("https://formsubmit.co/dev.proenca.samuel@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    alert("Email enviado com sucesso!");
    setFormData({ name: "", email: "", message: "" });
  } else {
    alert("Ocorreu um erro ao enviar o email.");
  }
};


  return (
    <section id="contact" className="text-start mb-20 mt-40">
      <h3 className="text-2xl font-semibold mb-4">Entre em contato</h3>
      <p className="text-neutral-400 mb-6 text-start">
        Get in touch or shoot me an email directly on dev.proenca.samuel@gmail.com
        <br />
        Lets build something great together!
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto" action="https://formsubmit.co/your@email.com" method="POST" >
        <label className="block mb-2">
          <span className="text-neutral-200">Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <label className="block mb-2">
          <span className="text-neutral-200">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <label className="block mb-4">
          <span className="text-neutral-200">Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <button
          type="submit"
          className="bg-cyan-500 text-neutral-950 font-semibold px-6 py-3 rounded-xl hover:bg-cyan-400 transition"
        >
          Send
        </button>
      </form>
    </section>
  );
}
