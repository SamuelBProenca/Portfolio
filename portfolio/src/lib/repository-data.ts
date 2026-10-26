export type RepositoryCard = {
  name: string;
  description: string;
  principal_languages: string[];
  stars: number;
  forks: number;
  url: string;
  illustration_image_url: string;
};

export type RepositoryIdentity = { owner: string; name: string };
type Fetcher = (
  url: string,
  init?: RequestInit & { next?: { revalidate: number } },
) => Promise<Response>;
export type DataOptions = { fetcher?: Fetcher; apiOrigin?: string; githubToken?: string };
const MAX_RESPONSE_BYTES = 256 * 1024;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function repositoryUrl(identity: RepositoryIdentity) {
  return `https://github.com/${identity.owner}/${identity.name}`;
}

export function parseRepositoryCard(value: unknown, identity: RepositoryIdentity): RepositoryCard {
  if (!record(value) || value.name !== identity.name || value.url !== repositoryUrl(identity))
    throw new Error("Unexpected repository identity");
  if (typeof value.description !== "string" || value.description.length > 120_000)
    throw new Error("Invalid README");
  if (
    !Array.isArray(value.principal_languages) ||
    value.principal_languages.length > 30 ||
    !value.principal_languages.every((item) => typeof item === "string" && item.length <= 48)
  )
    throw new Error("Invalid languages");
  for (const key of ["stars", "forks"]) {
    if (typeof value[key] !== "number" || !Number.isSafeInteger(value[key]) || value[key] < 0)
      throw new Error("Invalid repository metrics");
  }
  if (
    typeof value.illustration_image_url !== "string" ||
    value.illustration_image_url.length > 2048
  )
    throw new Error("Invalid image URL");
  if (value.illustration_image_url) {
    const image = new URL(value.illustration_image_url);
    if (image.protocol !== "https:" || image.username || image.password)
      throw new Error("Unsafe image URL");
  }
  // Select known fields only; upstream data cannot inject editorial flags or links.
  return {
    name: value.name as string,
    description: value.description,
    principal_languages: value.principal_languages as string[],
    stars: value.stars as number,
    forks: value.forks as number,
    url: value.url as string,
    illustration_image_url: value.illustration_image_url,
  };
}

async function responseText(response: Response) {
  if (!response.ok) throw new Error("Repository source unavailable");
  if (Number(response.headers.get("content-length")) > MAX_RESPONSE_BYTES)
    throw new Error("Response too large");
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error("Response too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export async function fetchRepositoryCard(identity: RepositoryIdentity, options: DataOptions = {}) {
  if (![identity.owner, identity.name].every((part) => /^[A-Za-z0-9_.-]{1,100}$/.test(part)))
    throw new Error("Invalid repository identifier");
  const fetcher = options.fetcher ?? fetch;
  const get = async (url: string, accept: string, authenticated = false) =>
    responseText(
      await fetcher(url, {
        headers: {
          Accept: accept,
          ...(authenticated && options.githubToken
            ? { Authorization: `Bearer ${options.githubToken}` }
            : {}),
        },
        signal: AbortSignal.timeout(2500),
        redirect: "error",
        next: { revalidate: 3600 },
      }),
    );
  if (options.apiOrigin) {
    const base = new URL(options.apiOrigin);
    const local =
      base.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
    if (
      (base.protocol !== "https:" && !local) ||
      base.username ||
      base.password ||
      base.pathname !== "/" ||
      base.search ||
      base.hash
    )
      throw new Error("Invalid OctoCards origin");
    const url = new URL(`/api/cards/${encodeURIComponent(identity.name)}`, base);
    url.searchParams.set("owner", identity.owner);
    return parseRepositoryCard(JSON.parse(await get(url.href, "application/json")), identity);
  }
  const endpoint = `https://api.github.com/repos/${identity.owner}/${identity.name}`;
  const meta: unknown = JSON.parse(await get(endpoint, "application/vnd.github+json", true));
  if (
    !record(meta) ||
    meta.private !== false ||
    meta.name !== identity.name ||
    meta.html_url !== repositoryUrl(identity)
  )
    throw new Error("Repository is not public");
  const [languages, readme] = await Promise.all([
    get(`${endpoint}/languages`, "application/vnd.github+json", true).then(
      (text) => JSON.parse(text) as unknown,
    ),
    fetcher(`${endpoint}/readme`, {
      headers: {
        Accept: "application/vnd.github.raw+json",
        ...(options.githubToken ? { Authorization: `Bearer ${options.githubToken}` } : {}),
      },
      signal: AbortSignal.timeout(2500),
      redirect: "error",
      next: { revalidate: 3600 },
    }).then((response) => (response.status === 404 ? "" : responseText(response))),
  ]);
  if (!record(languages)) throw new Error("Invalid language response");
  return parseRepositoryCard(
    {
      name: meta.name,
      description: readme || "Sem descrição",
      principal_languages: Object.keys(languages),
      stars: meta.stargazers_count,
      forks: meta.forks_count,
      url: meta.html_url,
      illustration_image_url: "",
    },
    identity,
  );
}
