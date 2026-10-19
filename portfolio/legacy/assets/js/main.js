(() => {
  const btn = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (btn && panel) {
    btn.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      btn.textContent = isOpen ? "✕" : "☰";
      document.body.classList.toggle("menu-open", isOpen);
    });
    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        panel.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = "☰";
        document.body.classList.remove("menu-open");
      }
    });
  }
})();
