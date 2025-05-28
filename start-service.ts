import { execSync, spawn } from "child_process";
import { once } from "events";
import { resolve } from "path";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import {
  Design,
  designsMap,
  domains,
  latinSquare,
  Site,
  sitesMap,
} from "./src/lib/studyData.ts";
import * as process from "node:process";

const customParticipantNumber = 0; // <=0 = none, >0 = custom
const openSites = 0;
const certs = 1;
const kioskMode = 1;
const currentCity = "Berlin";

const minPort = 3001; // 3000 is reserved for the study UI
const maxPort = 3003;
const shell = "cmd.exe";
const caddy = "caddy.exe";
const caddyfile = resolve("Caddyfile");
const certsDir = resolve("certs");
const certPath = resolve(certsDir, "cert.pem");
const keyPath = resolve(certsDir, "key.pem");

interface ParticipantResponse {
  pNumber: number;
  pName: string;
}
export type Entry = ReturnType<typeof getCounterbalancedEntries>[number];

(async () => {
  const { pNumber, pName } = await createNextParticipant();
  const entries = getCounterbalancedEntries(pNumber);

  if (certs) {
    // generateCertificates(); // run only once if domains change, then add to trust store and comment out again
    generateCaddyfile();
    startCaddy();
  }

  // await new Promise((resolve) => setTimeout(resolve, 1000000));
  killPorts();
  startApps({ pName, entries });

  await startupComplete();
  openBrowser();
})();

async function createNextParticipant(): Promise<ParticipantResponse> {
  while (true) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/create-participant/${customParticipantNumber}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}, ${response.statusText}`,
        );
      }

      const data = (await response.json()) as ParticipantResponse;
      console.log(`✅ Received participant with name ${data.pName}`);
      return data;
    } catch (error) {
      console.error("❌ Failed to fetch participant, retrying in 500ms...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

function getCounterbalancedEntries(participant: number) {
  const latinSquareIndex = (participant - 1) % latinSquare.length;
  console.log(
    `✅  Participant ${participant} will get Latin Square no. ${latinSquareIndex + 1}`,
  );

  const assignments = latinSquare[latinSquareIndex];

  return assignments.map(([siteIndex, designIndex]) => {
    const site = sitesMap[siteIndex as keyof typeof sitesMap];
    return {
      site,
      design: designsMap[designIndex as keyof typeof designsMap],
      domain: domains[site],
    };
  });
}

function spawnApp({
  site,
  domain,
  design,
  port,
  pName,
  entries,
  tasks,
}: {
  site: string;
  domain?: string;
  design?: Design;
  port: number;
  pName?: string;
  entries?: Entry[];
  tasks: Site[];
}) {
  console.log(`🚀 Starting ${site} site on port ${port}...`);

  spawn(shell, ["/c", "vite"], {
    stdio: "inherit",
    env: {
      ...process.env,
      CHOKIDAR_USEPOLLING: "true",
      NODE_OPTIONS: "--max_old_space_size=4096",
      PORT: String(port),
      VITE_PARTICIPANT: pName ?? "",
      VITE_ENTRIES: JSON.stringify(entries ?? []),
      VITE_SITE: site,
      VITE_DESIGN: design ?? "",
      VITE_CITY: currentCity,
      VITE_TASKS: tasks.join(","),
      VITE_HOST: domain ?? "localhost",
      BROWSER: "none",
    },
  });
}

// === Start apps in parallel
function startApps({ pName, entries }: { pName: string; entries: Entry[] }) {
  const tasks = entries.map((e) => e.site);

  // Study UI
  spawnApp({
    site: "study",
    port: 3000,
    pName,
    tasks,
    entries,
  });

  // Other apps
  entries.forEach(({ site, domain, design }, i) => {
    const port = minPort + Object.values(domains).indexOf(domain);
    console.log(`Starting ${site} on port ${port} with design ${design}...`);
    spawnApp({ site, domain, design, port, pName, tasks });
  });
}

async function startupComplete() {
  const urls = Object.values(domains).map(
    (domain, i) => `http://localhost:${minPort + i}`,
  );
  console.log("🔐 Waiting for apps to be ready...");

  const proc = spawn(shell, ["/c", `npx wait-on ${urls.join(" ")}`], {
    stdio: "inherit",
    env: process.env,
  });
  await once(proc, "exit");
  console.log("✅ Apps are ready.");
}

// === Open apps in browser
function openBrowser() {
  const profileDir = resolve("_browser-profile");
  if (existsSync(profileDir)) {
    try {
      rmSync(profileDir, { recursive: true, force: true });
      console.log(`🗑️ Deleted browser profile directory: ${profileDir}`);
    } catch (error) {
      console.error(`❌ Failed to delete browser profile directory: ${error}`);
      process.exit(1);
    }
  }

  let urls = [
    "http://localhost:3000",
    ...(openSites
      ? Object.values(domains).map((domain, i) =>
          certs ? `https://${domain}` : `http://localhost:${minPort + i}`,
        )
      : []),
  ];
  const urlStr = urls.join(" ");

  const chromeOptions = kioskMode
    ? [
        "--kiosk",
        "--remote-debugging-port=9222",
        "--no-first-run",
        "--new-window",
        `--user-data-dir=${profileDir}`,
        "--disable-extensions",
        "--no-default-browser-check",
        "--disable-restore-session-state",
        "--disable-popup-blocking",
        "--disable-features=PaymentRequest,AutofillSaveCardPrompt,Translate,PrivacySandboxPrompt",
        "--no-experiments",
        "--disable-background-networking",
        "--disable-background-apps",
        "--disable-sync",
        "--start-maximized",
        "--disable-infobars",
        "--disable-save-password-bubble",
        "--disable-client-side-phishing-detection",
      ].join(" ")
    : "";

  spawn(shell, ["/c", `start chrome.exe ${chromeOptions} ${urlStr}`], {
    stdio: "inherit",
  });
}

// === Generate self-signed certificates if they don't exist
function generateCertificates() {
  console.log("🔑 Generating self-signed certificates...");
  mkdirSync(certsDir, { recursive: true });

  const domainList = Object.values(domains)
    .map((d) => `DNS:${d}`)
    .join(",");
  const opensslCmd = `openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 3650 -nodes -subj "/CN=*.travel" -addext "subjectAltName=${domainList}"`;

  try {
    execSync(opensslCmd, { stdio: "inherit" });
    console.log(`✅ Generated certificates at ${certPath} and ${keyPath}`);
  } catch (error) {
    console.error("❌ Failed to generate certificates:", error);
    process.exit(1);
  }
}

// === Generate Caddyfile
function generateCaddyfile() {
  const certPathEscaped = certPath.replace(/\\/g, "/");
  const keyPathEscaped = keyPath.replace(/\\/g, "/");
  const content =
    Object.values(domains)
      .map(
        (domain, i) =>
          `${domain} {\n\ttls ${certPathEscaped} ${keyPathEscaped}\n\treverse_proxy localhost:${minPort + i}\n}`,
      )
      .join("\n\n") + "\n";
  writeFileSync(caddyfile, content);
  console.log("📝 Generated Caddyfile:\n" + content);
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

// === Kill processes on all ports
function killPorts() {
  for (let port = 3000; port <= maxPort; port++) {
    try {
      execSync(
        `for /f "tokens=5" %a in ('netstat -aon ^| find ":${port} "') do taskkill /PID %a /F`,
        { stdio: "ignore" },
      );
      console.log(`🛑 Freed port ${port}`);
    } catch {
      console.log(`ℹ️ Port ${port} was not in use.`);
    }
  }
}
