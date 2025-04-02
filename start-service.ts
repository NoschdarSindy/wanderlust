import { execSync, spawn } from "child_process";
import { once } from "events";
import { resolve } from "path";
import { writeFileSync } from "fs";
import websiteData from "src/lib/siteData";

const isWin = process.platform === "win32";
const shell = isWin ? "cmd.exe" : "bash";
const caddy = "caddy.exe";
const caddyfile = resolve("Caddyfile");
let prod = 1;
if (!isWin) prod = 0;
const openBrowser = 0;

const mapping: Record<string, string> = {};
for (const name in websiteData) {
  mapping[name] = websiteData[name].domain;
}
const entries = Object.entries(mapping);

(async () => {
  if (prod) {
    generateCaddyfile();
    startCaddy();
  }
  killPorts();
  startApps();
  if (openBrowser) {
    await startupComplete();
    openApps();
  }
})();

// === Start apps in parallel
function startApps() {
  entries.forEach(([site, domain], i) => {
    const port = String(3000 + i);
    console.log(`🚀 Starting ${site} site on port ${port}...`);

    spawn(shell, [isWin ? "/c" : "-c", "react-scripts start"], {
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: port,
        REACT_APP_PARTICIPANT: String(1),
        REACT_APP_SITE: site,
        REACT_APP_DESIGN: "dark",
        BROWSER: "none",
        ...(prod
          ? {
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

async function startupComplete() {
  const urls = entries.map(([, domain], i) =>
    prod ? `https://${domain}` : `http://localhost:${3000 + i}`,
  );
  console.log("🔐 Waiting for apps to be ready...");

  const proc = spawn(
    shell,
    [isWin ? "/c" : "-c", `npx wait-on ${urls.join(" ")}`],
    {
      stdio: "inherit",
      env: process.env,
    },
  );

  await once(proc, "exit");
  console.log("✅ Apps are ready.");
}

// === Open apps in browser
function openApps() {
  const urls = entries
    .map(([, domain], i) =>
      prod ? `https://${domain}` : `http://localhost:${3000 + i}`,
    )
    .join(" ");
  const openCmd = isWin
    ? ["/c", `start chrome ${urls}`]
    : ["-c", `open -a "Google Chrome" ${urls}`];

  spawn(shell, openCmd, {
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
