import { spawn } from "node:child_process";
import { validate, waitServer } from "../utils.mjs";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const PORT = "3102";
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function run() {
  console.log("Starting fixture server...");

  /*
  When building in a pnpm workspace rooted at the repo root, 
  Next.js mirrors the full workspace-relative path inside .next/standalone,
  so server.js ends up at .next/standalone/tests/standalone/server.js and
  static assets must be placed at .next/standalone/tests/standalone/.next/static.
  */

  const tmpBase = join(tmpdir(), "standalone");
  if (existsSync(tmpBase)) rmSync(tmpBase, { recursive: true });
  mkdirSync(tmpBase, { recursive: true });

  // cp -r の代わり
  cpSync(".next/standalone", tmpBase, { recursive: true });
  cpSync(".next/static", join(tmpBase, "tests/standalone/.next/static"), {
    recursive: true,
  });
  if (existsSync("public")) {
    cpSync("public", join(tmpBase, "tests/standalone/public"), {
      recursive: true,
    });
  }

  const serverScript = join(tmpBase, "tests/standalone/server.js");
  const server = spawn("node", [serverScript], {
    shell: true,
    env: { ...process.env, PORT },
    stdio: "inherit",
  });

  // スクリプト終了時にサーバーを確実に殺すための処理
  const cleanup = () => {
    console.log("\nCleaning up server process...");
    server.kill();
  };
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  await waitServer(BASE_URL);

  const urls = [`${BASE_URL}/api/licenses`, `${BASE_URL}/`];
  const targets = ["next", "react", "react-dom"];
  await validate(urls, targets);

  process.exit(0);
}

run();
