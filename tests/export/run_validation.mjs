import { validate } from "../utils.mjs";

async function run() {
  const urls = ["./out/index.html"];
  const targets = ["next", "react", "react-dom"];
  await validate(urls, targets);
}

run();
