import LicensePlugin from "webpack-license-plugin";
import type { NextConfig } from "next";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { createHash } from "node:crypto";
import webpack from "webpack";
import { fileURLToPath } from "node:url";

interface IPackageLicenseMeta {
  author: string;
  license: string;
  licenseText: string;
  name: string;
  noticeText?: string;
  repository: string;
  source: string;
  version: string;
}
interface IPluginOptions {
  additionalFiles: {
    [filename: string]: (
      packages: IPackageLicenseMeta[],
    ) => string | Promise<string>;
  };
  licenseOverrides: {
    [packageVersion: string]: string;
  };
  // outputFilename: string;
  replenishDefaultLicenseTexts: boolean;
  includeNoticeText: boolean;
  unacceptableLicenseTest: (licenseIdentifier: string) => boolean;
  excludedPackageTest: (packageName: string, packageVersion: string) => boolean;
  includePackages: () => string[] | Promise<string[]>;
}
export function withLicense(
  nextConfig: NextConfig,
  pluginOptions: Partial<IPluginOptions>,
): NextConfig {
  const hash = createHash("sha1");
  for (let cwd = process.cwd(); cwd !== dirname(cwd); cwd = dirname(cwd)) {
    for (const lockfile of [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lock",
      "bun.lockb",
    ]) {
      if (existsSync(join(cwd, lockfile))) {
        hash.update(readFileSync(join(cwd, lockfile)));
      }
    }
  }
  const finalHash = hash.digest("hex").slice(0, 8);
  mkdirSync(
    join(dirname(dirname(fileURLToPath(import.meta.url))), "generated"),
    { recursive: true },
  );
  return {
    ...nextConfig,
    webpack(config, options) {
      if (!options.isServer) {
        config.plugins.push(
          new LicensePlugin({
            // node_modulesのこのパッケージのディレクトリに出力し、 "next-license-list/generated/hash.json" としてimportする
            outputFilename: relative(
              config.output.path,
              join(
                dirname(dirname(fileURLToPath(import.meta.url))),
                "generated",
                `${finalHash}.json`,
              ),
            ),
            ...pluginOptions,
          }),
        );
        config.plugins.push(
          new webpack.DefinePlugin({
            NEXT_LICENSE_LIST_HASH: JSON.stringify(hash),
          }),
        );
        config.resolve.alias = {
          ...config.resolve.alias,
          // clientのバンドルのビルド時にはまだlicensesファイルが生成されていないので、
          // nullを返すダミーのファイルにフォールバック
          "next-license-list-file": "next-license-list/null.json",
        };
      } else {
        let outputPath = config.output.path;
        if (outputPath.endsWith("chunks")) {
          outputPath = dirname(outputPath);
        }
        if (outputPath.endsWith("server")) {
          outputPath = dirname(outputPath);
        }
        config.externals = [
          ...config.externals,
          {
            "next-license-list-file": `next-license-list/generated/${finalHash}.json`,
          },
        ];
      }
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }
      return config;
    },
  } satisfies NextConfig;
}
