import { spawn } from "node:child_process";
import { validate, waitServer } from "../utils.mjs";

const PORT = "3101";
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function run() {
  console.log("Starting fixture server...");

  // 1. サーバーの起動 (pnpm start)
  const server = spawn("pnpm", ["start"], {
    env: { ...process.env, PORT },
    shell: true, // Windowsでの互換性のために必要
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
