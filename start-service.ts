import { execSync, spawn } from "child_process";
import { once } from "events";
import { resolve } from "path";
import { writeFileSync } from "fs";
import fetch from "node-fetch";
import {
  domains,
  sitesMap,
  latinSquare,
  designsMap,
  Site,
  Design,
} from "./src/lib/studyData";
import * as process from "node:process";

let prod = 1;
const customParticipantNumber = 1; // <=0 = none, >0 = custom
const openBrowser = 0;
const currentCity = "Berlin";

const minPort = 3001; // 3000 is reserved for the study UI
const maxPort = 3003;
const isWin = process.platform === "win32";
const shell = isWin ? "cmd.exe" : "bash";
const caddy = "caddy.exe";
const caddyfile = resolve("Caddyfile");
if (!isWin) prod = 0;

interface ParticipantResponse {
  pNumber: number;
  pName: string;
}
type Entry = ReturnType<typeof getCounterbalancedEntries>[number];

(async () => {
  const { pNumber, pName } = await createNextParticipant();
  const entries = getCounterbalancedEntries(pNumber);

  if (prod) {
    generateCaddyfile();
    startCaddy();
  }

  killPorts();
  startApps({ pName, entries });

  if (openBrowser) {
    await startupComplete();
    openApps();
  }
})();

async function createNextParticipant(): Promise<ParticipantResponse> {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/create-participant/${customParticipantNumber}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = (await response.json()) as ParticipantResponse;
    console.log(`✅  Received participant with name ${data.pName}`);

    return data;
  } catch (error) {
    console.error("❌ Error fetching next participant:", error);
    throw error;
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
  tasks,
  openBrowser,
}: {
  site: string;
  domain?: string;
  design?: Design;
  port: number;
  pName?: string;
  tasks: Site[];
  openBrowser?: boolean;
}) {
  console.log(`🚀 Starting ${site} site on port ${port}...`);
  spawn(shell, [isWin ? "/c" : "-c", "react-scripts start"], {
    stdio: "inherit",
    env: {
      ...process.env,
      CHOKIDAR_USEPOLLING: "true",
      NODE_OPTIONS: "--max_old_space_size=4096",
      PORT: String(port),
      REACT_APP_PARTICIPANT: pName,
      REACT_APP_SITE: site,
      REACT_APP_DESIGN: design,
      REACT_APP_CITY: currentCity,
      REACT_APP_TASKS: tasks.join(),
      BROWSER: openBrowser ? `http://localhost:${port}/config` : "none",
      ...(prod
        ? {
            HOST: domain,
            WDS_SOCKET_PORT: String(port),
            WDS_SOCKET_HOST: "localhost",
            WDS_SOCKET_PROTOCOL: "wss",
            CI: "true",
          }
        : {}),
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
    openBrowser: true,
  });

  // Other apps
  entries.forEach(({ site, domain, design }, i) => {
    const port = minPort + i;
    spawnApp({ site, domain, design, port, pName, tasks });
  });
}

async function startupComplete() {
  const urls = Object.values(domains).map((domain, i) =>
    prod ? `https://${domain}` : `http://localhost:${minPort + i}`,
  );
  console.log("🔐 Waiting for apps to be ready...");

  const proc = spawn(
    shell,
    [isWin ? "/c" : "-c", `npx wait-on ${urls.join(" ")}`],
    { stdio: "inherit", env: process.env },
  );
  await once(proc, "exit");
  console.log("✅ Apps are ready.");
}

// === Open apps in browser
function openApps() {
  const urls = Object.values(domains)
    .map((domain, i) =>
      prod ? `https://${domain}` : `http://localhost:${minPort + i}`,
    )
    .join(" ");
  spawn(
    shell,
    [
      isWin ? "/c" : "-c",
      isWin ? `start chrome ${urls}` : `open -a "Google Chrome" ${urls}`,
    ],
    { stdio: "inherit" },
  );
}

// === Generate Caddyfile
function generateCaddyfile() {
  const content =
    `{\n\tlocal_certs\n}\n\n` +
    Object.values(domains)
      .map(
        (domain, i) =>
          `${domain} {\n\treverse_proxy localhost:${minPort + i}\n}`,
      )
      .join("\n\n") +
    "\n";
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
