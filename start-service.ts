import { execSync, spawn } from "child_process";
import { once } from "events";
import { resolve } from "path";
import { writeFileSync } from "fs";
import websiteData from "./src/data";

const shell = "cmd.exe";
const caddy = "caddy.exe";
const caddyfile = resolve("Caddyfile");
const prod = 1;

const mapping: Record<string, string> = {};
for (const name in websiteData) {
  mapping[name] = websiteData[name].domain;
}
const entries = Object.entries(mapping);

(async () => {
  if (prod) generateCaddyfile();
  killPorts();
  startApps();
  if (prod) {
    startCaddy();
    await waitForHttpsReady();
    openApps();
  }
})();

// === Start apps in parallel
function startApps() {
  entries.forEach(([site, domain], i) => {
    const port = String(3000 + i);
    console.log(`🚀 Starting ${site} site on port ${port}...`);

    spawn(shell, ["/c", "react-scripts start"], {
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: port,
        REACT_APP_SITE: site,
        ...(prod
          ? {
              BROWSER: "none",
              HOST: domain,
              WDS_SOCKET_PORT: port,
              WDS_SOCKET_HOST: "localhost",
              WDS_SOCKET_PROTOCOL: "wss",
              CI: "true",
            }
          : {}),
      },
    });
  });
}

// === NEW: Wait for TLS certs to be served (https://domain)
async function waitForHttpsReady() {
  const urls = entries.map(([, domain]) => `https://${domain}`);
  console.log("🔐 Waiting for HTTPS to be ready...");

  const proc = spawn(shell, ["/c", `npx wait-on ${urls.join(" ")}`], {
    stdio: "inherit",
    env: process.env,
  });

  await once(proc, "exit");
  console.log("✅ HTTPS certs are valid and serving.");
}

// === Open apps in browser
function openApps() {
  const urls = entries.map(([, domain]) => `https://${domain}`);
  spawn(shell, ["/c", `start chrome ${urls.join(" ")}`], {
    stdio: "inherit",
  });
}

// === Generate Caddyfile
function generateCaddyfile() {
  const header = "{\n\tlocal_certs\n}\n\n";

  const content =
    entries
      .map(([, domain], i) => {
        return `${domain} {\n\treverse_proxy localhost:${3000 + i}\n}`;
      })
      .join("\n\n") + "\n";

  const full = header + content;

  writeFileSync(caddyfile, full);
  console.log("📝 Generated Caddyfile:\n" + full);
}

// === Start Caddy reverse proxy
function startCaddy() {
  console.log("🚀 Starting Caddy reverse proxy...");

  const proc = spawn(shell, ["/c", `${caddy} run --config ${caddyfile}`], {
    stdio: "inherit",
  });

  proc.on("error", (err) => {
    console.error("❌ Failed to start Caddy:", err);
    process.exit(1);
  });
}

// === Kill processes on ports 3000+ to avoid conflicts
function killPorts() {
  for (let i = 0; i < entries.length; i++) {
    const port = 3000 + i;
    try {
      const command = `for /f "tokens=5" %a in ('netstat -aon ^| find ":${port} "') do taskkill /PID %a /F`;
      execSync(command, { stdio: "ignore" });
      console.log(`🛑 Freed port ${port}`);
    } catch {
      console.log(`ℹ️ Port ${port} was not in use.`);
    }
  }
}
