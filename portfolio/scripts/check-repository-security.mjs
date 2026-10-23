import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const gitOptions = ["-c", `safe.directory=${root.replaceAll("\\", "/")}`];

export function isSensitivePath(value) {
  const path = value.replaceAll("\\", "/").toLowerCase();
  if (/(^|\/)(\.aws|\.ssh|\.gnupg|\.codex|\.agents|\.vercel)(\/|$)/.test(path)) return true;
  const name = path.split("/").at(-1);
  if (name.startsWith(".env")) return name !== ".env.example";
  return (
    /\.(pem|key|p12|pfx|jks|keystore)$/.test(name) ||
    /\.tfstate(\..*)?$/.test(name) ||
    /^(\.npmrc|\.pypirc|\.netrc|\.git-credentials|id_rsa|id_ed25519|id_ecdsa|id_dsa)$/.test(name) ||
    /^credentials(\.(json|yaml|yml))?$/.test(name) ||
    /^service[-_]account.*\.json$/.test(name)
  );
}

export function invalidExampleVariables(text) {
  const invalid = [];
  for (const line of text.split(/\r?\n/)) {
    const entry = line.trim().match(/^(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=\s*(.*)$/i);
    if (
      !entry ||
      !/(KEY|TOKEN|SECRET|PASSWORD|PASSWD|DATABASE_URL|CONNECTION_STRING|DSN)/i.test(entry[1])
    ) {
      continue;
    }
    const value = entry[2].split(/\s+#/)[0].trim();
    if (value && value !== '""' && value !== "''") invalid.push(entry[1]);
  }
  return invalid;
}

function git(args) {
  const result = spawnSync("git", [...gitOptions, ...args], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error("Cannot inspect the Git index; security check stopped.");
  return result.stdout;
}

function main() {
  const mode = process.argv[2] ?? "--history";
  if (!["--staged", "--history"].includes(mode)) throw new Error("Use --staged or --history.");
  const files = git(["ls-files", "--cached", "-z"]).split("\0").filter(Boolean);
  const blocked = files.filter(isSensitivePath);
  if (blocked.length) {
    // Report paths only. Never print a file's contents or a suspected credential.
    console.error("Private files must not be tracked:");
    for (const path of blocked) console.error(`- ${path}`);
    return 1;
  }
  for (const path of files.filter(
    (path) => path.split("/").at(-1).toLowerCase() === ".env.example",
  )) {
    const invalid = invalidExampleVariables(git(["show", `:${path}`]));
    if (invalid.length) {
      console.error(`Secret fields in ${path} must be empty: ${invalid.join(", ")}`);
      return 1;
    }
  }

  const cached = join(
    root,
    ".cache",
    "security",
    process.platform === "win32" ? "gitleaks.exe" : "gitleaks",
  );
  const scanner = existsSync(cached) ? cached : "gitleaks";
  const args = [
    "git",
    root,
    "--config",
    join(root, ".gitleaks.toml"),
    "--redact=100",
    "--ignore-gitleaks-allow",
    "--no-banner",
    "--no-color",
  ];
  args.push(
    ...(mode === "--staged"
      ? ["--pre-commit", "--staged"]
      : ["--log-opts=--all --full-history --diff-merges=first-parent"]),
  );
  // Append the repository trust setting without replacing existing Git configuration.
  const env = { ...process.env };
  const count = Number(env.GIT_CONFIG_COUNT ?? 0);
  if (!Number.isSafeInteger(count) || count < 0)
    throw new Error("Invalid Git configuration; scan stopped.");
  env[`GIT_CONFIG_KEY_${count}`] = "safe.directory";
  env[`GIT_CONFIG_VALUE_${count}`] = root.replaceAll("\\", "/");
  env.GIT_CONFIG_COUNT = String(count + 1);
  const scan = spawnSync(scanner, args, { cwd: root, env, stdio: "inherit" });
  if (scan.error) {
    console.error(
      "Gitleaks is required. Install the verified CLI as described in docs/SECURITY.md.",
    );
    return 2;
  }
  if (scan.status !== 0) {
    console.error("Security scan did not pass. Do not commit or push until it is resolved.");
    return scan.status ?? 2;
  }
  console.log("Repository security check passed; credential values were not printed.");
  return 0;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Security check failed.");
    process.exitCode = 2;
  }
}
