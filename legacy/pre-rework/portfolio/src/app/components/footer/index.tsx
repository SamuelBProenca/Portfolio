import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <footer className="mt-8 py-8 text-center border-t dark:border-neutral-700 border-neutral-300">
      <div className="flex justify-center gap-6 mb-4 text-xl">
        <a
          href="https://github.com/seuusuario"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/seuusuario"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          <FaLinkedin />
        </a>
        <a
          href="mailto:email@exemplo.com"
          className="hover:text-blue-500 transition-colors"
        >
          <FaEnvelope />
        </a>
      </div>
      <p className="text-sm dark:text-neutral-400 text-neutral-600">
        © {new Date().getFullYear()} Samuel Proença — All rights reserved.
      </p>
      <p className="text-xs mt-1 dark:text-neutral-500 text-neutral-500">
        Built with Next.js & TailwindCSS
      </p>
    </footer>
  );
};

export default FooterComponent;
