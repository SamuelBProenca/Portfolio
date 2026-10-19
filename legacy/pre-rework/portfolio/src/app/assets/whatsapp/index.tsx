import React from "react";
import Image from "next/image";

export default function ContactWP() {
  const whatsappNumber = "5519989587907"; // Substitua pelo seu número real
  const whatsappMessage = "Olá Samuel, gostaria de saber mais sobre seus serviços, vim do seu portifólio pessoal!";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition duration-300"
    >
      <Image src="wp-img.svg" alt="WhatsApp Icon" className="w-8 h-8" width={32} height={32} />
      <span className="hidden sm:inline text-neutral-950" >Talk With Me</span>
    </a>
  );
}
