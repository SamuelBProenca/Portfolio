import { resolve4 } from "node:dns/promises";
import { request } from "node:https";
import { isIPv4 } from "node:net";
import { performance } from "node:perf_hooks";

// Test TLS with the real hostname while selecting each DNS address separately.
// A successful address must not mask another address that silently times out.
const hosts = ["samuelproenca.com", "www.samuelproenca.com"];
const selectedIp = process.argv.find((value) => value.startsWith("--ip="))?.slice(5);
if (selectedIp && !isIPv4(selectedIp)) {
  throw new Error("Use --ip=<IPv4 address> to check a specific route.");
}

function checkAddress(host, address) {
  return new Promise((resolve) => {
    const start = performance.now();
    const req = request(
      {
        hostname: address,
        servername: host,
        headers: { Host: host },
        method: "HEAD",
        path: "/",
        agent: false,
        signal: AbortSignal.timeout(5000),
      },
      (response) => {
        response.resume();
        const ok = host.startsWith("www.")
          ? response.statusCode === 200
          : [301, 302, 307, 308].includes(response.statusCode ?? 0) &&
            response.headers.location === "https://www.samuelproenca.com/";
        resolve({
          host,
          address,
          status: response.statusCode,
          ms: Math.round(performance.now() - start),
          ok,
        });
      },
    );
    req.on("error", (error) => {
      resolve({
        host,
        address,
        status: error.code ?? error.name,
        ms: Math.round(performance.now() - start),
        ok: false,
      });
    });
    req.end();
  });
}

const results = [];
for (const host of hosts) {
  try {
    const addresses = selectedIp ? [selectedIp] : await resolve4(host);
    results.push(...(await Promise.all(addresses.map((address) => checkAddress(host, address)))));
  } catch (error) {
    results.push({ host, status: error.code ?? error.name, ok: false });
  }
}
console.table(results);
if (results.some((result) => !result.ok)) {
  console.error(
    "At least one DNS destination failed. Compare with Vercel Settings > Domains and test another network before changing DNS.",
  );
  process.exitCode = 1;
}
