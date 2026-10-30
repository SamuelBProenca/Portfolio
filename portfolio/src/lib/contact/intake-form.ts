/** Accept published Google Forms responder URLs, never editor or arbitrary URLs. */
export function getProjectIntakeFormUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const shortLink = url.hostname === "forms.gle" && /^\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);
    const responderLink =
      url.hostname === "docs.google.com" &&
      /^\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform\/?$/.test(url.pathname);
    return shortLink || responderLink ? url.href : null;
  } catch {
    return null;
  }
}
