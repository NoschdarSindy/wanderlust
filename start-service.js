const { spawn } = require("child_process");
const { once } = require("events");
const { resolve } = require("path");
const { execSync } = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");
const websiteData = require("./src/data.ts").default;

const openBrowser = true;
const isMac = os.platform() === "darwin";
const shell = "/bin/bash";

const mapping = {};
for (const name in websiteData) {
  mapping[name] = websiteData[name].domain;
}
const entries = Object.entries(mapping);

(async () => {
  await startNginx();
  console.log("🟢 nginx is up and running");

  // Step 1: Start all services in parallel
  entries.forEach(([app], i) => {
    const port = 3000 + i;

    const reactArgs = [
      "-c",
      `BROWSER=none REACT_APP_TYPE=${app} PORT=${port} react-scripts start`,
    ];

    spawn(shell, reactArgs, { stdio: "inherit", env: process.env });
  });

  // Step 2: Wait for each service to be ready and open browser
  if (openBrowser) {
    for (const [app, domain] of entries) {
      const port = 3000 + Object.keys(mapping).indexOf(app);
      const waitArgs = ["-c", `npx wait-on http://localhost:${port}`];

      const waitProc = spawn(shell, waitArgs, {
        stdio: "inherit",
        env: process.env,
      });

      await once(waitProc, "exit");

      if (isMac) {
        spawn("open", ["-a", "Google Chrome", `http://${domain}`], {
          stdio: "inherit",
        });
      } else {
        spawn("cmd.exe", ["/c", `start chrome http://${domain}`], {
          stdio: "inherit",
        });
      }
    }
  }
})();

function killExistingNginx() {
  try {
    execSync("sudo pkill nginx");
    console.log("🛑 Killed existing nginx processes.");
  } catch {
    console.log("ℹ️ No nginx processes to kill.");
  }
}

async function startNginx() {
  const nginxConfPath = resolve("nginx.conf");

  if (updateNginx()) {
    killExistingNginx();
    console.log("🚀 Starting nginx with custom config...");
    const nginxProc = spawn("sudo", ["nginx", "-c", nginxConfPath], {
      stdio: "inherit",
    });

    const [exitCode] = await once(nginxProc, "exit");
    if (exitCode !== 0) {
      console.error(
        `❌ nginx failed to start (exit code ${exitCode}). Aborting.`,
      );
      process.exit(1);
    }
  } else {
    console.log("🌀 nginx config unchanged, skipping restart.");
  }
}

function updateNginx() {
  const nginx = `events {}
http {
    default_type  application/octet-stream;
${Object.values(mapping)
  .map(
    (domain, i) => `    server {
        listen 80;
        server_name ${domain};

        location / {
            proxy_pass http://localhost:${3000 + i};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }`,
  )
  .join("\n\n")}
}
`;

  const outputPath = path.resolve("nginx.conf");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  let needsUpdate = true;

  if (fs.existsSync(outputPath)) {
    const current = fs.readFileSync(outputPath, "utf8");
    if (current.trim() === nginx.trim()) {
      console.log("✅ nginx.conf is already up to date.");
      needsUpdate = false;
    }
  }

  if (needsUpdate) {
    fs.writeFileSync(outputPath, nginx);
    console.log("📝 Updated nginx.conf at:", outputPath);
  }

  return needsUpdate;
}
