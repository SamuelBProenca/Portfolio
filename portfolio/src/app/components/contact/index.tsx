'use client';
import { useEffect, useState } from 'react';

export default function Contact() {
  const [locale, setLocale] = useState<'pt' | 'en'>('en');
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    tags: [] as string[],
  });

  useEffect(() => {
    const lang = navigator.language || 'en';
    setLocale(lang.startsWith('pt') ? 'pt' : 'en');
  }, []);

  const t = {
    title: locale === 'pt' ? 'Entre em contato' : 'Get in touch',
    subtitle:
      locale === 'pt'
        ? 'Ou envie um email diretamente para contact@samuelproenca.com'
        : 'Or email me directly at contact@samuelproenca.com',
    labels: {
      name: locale === 'pt' ? 'Nome *' : 'Name *',
      email: locale === 'pt' ? 'Email *' : 'Email *',
      company: locale === 'pt' ? 'Empresa' : 'Company',
      subject: locale === 'pt' ? 'Assunto *' : 'Subject *',
      message: locale === 'pt' ? 'Mensagem *' : 'Message *',
      tags: locale === 'pt' ? 'Tags (opcional)' : 'Tags (optional)',
      placeholderName: locale === 'pt' ? 'Seu nome completo' : 'Your full name',
      placeholderEmail: locale === 'pt' ? 'email@exemplo.com' : 'email@example.com',
      placeholderCompany: locale === 'pt' ? 'Nome da empresa (opcional)' : 'Company name (optional)',
      placeholderSubject: locale === 'pt' ? 'Sobre o que deseja falar?' : 'What do you want to talk about?',
      placeholderMessage: locale === 'pt' ? 'Escreva sua mensagem aqui...' : 'Write your message here...',
      placeholderTags: locale === 'pt' ? 'Pressione Enter ou , para adicionar' : 'Press Enter or , to add',
      send: locale === 'pt' ? 'Enviar' : 'Send',
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ','].includes(e.key) && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('https://formsubmit.co/dev.proenca.samuel@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert(locale === 'pt' ? 'Email enviado com sucesso!' : 'Email sent successfully!');
      setFormData({ name: '', email: '', company: '', subject: '', message: '', tags: [] });
      setTagInput('');
    } else {
      alert(locale === 'pt' ? 'Erro ao enviar email.' : 'Error sending email.');
    }
  };

  return (
    <section id="contact" className="mb-20 mt-40 px-6">
      <h3 className="text-3xl font-semibold mb-2">{t.title}</h3>
      <p className="text-neutral-400 mb-8">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        <label className="block col-span-1">
          <span className="text-neutral-200">{t.labels.name}</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={t.labels.placeholderName}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <label className="block col-span-1">
          <span className="text-neutral-200">{t.labels.email}</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={t.labels.placeholderEmail}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <label className="block col-span-1">
          <span className="text-neutral-200">{t.labels.company}</span>
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={t.labels.placeholderCompany}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <label className="block col-span-1">
          <span className="text-neutral-200">{t.labels.subject}</span>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder={t.labels.placeholderSubject}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <label className="block col-span-2">
          <span className="text-neutral-200">{t.labels.message}</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            placeholder={t.labels.placeholderMessage}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
        </label>

        <div className="col-span-2">
          <span className="text-neutral-200">{t.labels.tags}</span>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={t.labels.placeholderTags}
            className="w-full px-4 py-2 rounded bg-neutral-900 text-white mt-1"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                onClick={() => handleRemoveTag(tag)}
                className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-cyan-400"
              >
                {tag} ✕
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-cyan-500 text-neutral-950 font-semibold px-6 py-3 rounded-xl hover:bg-cyan-400 transition col-span-2 hover:cursor-pointer mt-4"
        >
          {t.labels.send}
        </button>
      </form>
    </section>
  );
}
