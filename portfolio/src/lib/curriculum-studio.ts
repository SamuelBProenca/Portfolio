/** Server configuration only. The upstream is public; credentials are never accepted. */
export function curriculumStudioRewrites(value: string | undefined, allowLocal = false) {
  if (!value?.trim()) return [];
  let origin: URL;
  try {
    origin = new URL(value.trim());
  } catch {
    throw new Error("CURRICULUM_STUDIO_ORIGIN must be an HTTPS origin.");
  }
  const local =
    allowLocal &&
    origin.protocol === "http:" &&
    ["127.0.0.1", "localhost"].includes(origin.hostname);
  if (
    (!local && origin.protocol !== "https:") ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash ||
    origin.pathname !== "/"
  ) {
    throw new Error(
      "CURRICULUM_STUDIO_ORIGIN must be an HTTPS origin without credentials or a path.",
    );
  }
  return [
    { source: "/curriculumstudio", destination: `${origin.origin}/` },
    { source: "/curriculumstudio/:path*", destination: `${origin.origin}/:path*` },
  ];
}
