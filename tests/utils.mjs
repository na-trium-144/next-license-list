import { readFileSync } from "node:fs";
import { setTimeout } from "node:timers/promises";

export async function waitServer(base_url) {
  // 2. サーバーが起動するまでポーリング (最大30秒)
  for (let i = 1; i <= 30; i++) {
    try {
      const res = await fetch(base_url);
      if (res.ok) {
        return;
      }
    } catch (e) {
      // まだ起動していない場合は無視して待機
    }
    await setTimeout(1000);
  }

  throw new Error("Server failed to start within 30 seconds");
}

export async function validate(urls, targets) {
  let hasError = false;

  for (const url of urls) {
    // 3. APIからデータを取得
    let content;
    if(url.startsWith("http")) {
      const apiRes = await fetch(url);
      content = await apiRes.text();
    } else {
      content = readFileSync(url, "utf-8");
    }

    // 4. 内容の出力
    console.log(`=== ${url} ===`);
    console.log(content.slice(0, 100) + "...");

    // 5. バリデーション
    for (const target of targets) {
      if (!content.includes(target)) {
        console.error(`Error: "${target}" not found in ${url}`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    throw new Error("Validation failed");
  }

  console.log("Validation successful!");
}
