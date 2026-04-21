import LicensePlugin from "webpack-license-plugin";
import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
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
) {
  const packageLockJson = readFileSync(
    join(process.cwd(), "package-lock.json"),
    "utf-8",
  );
  const hash = createHash("sha1")
    .update(packageLockJson)
    .digest("hex")
    .slice(0, 8);
  return {
    ...nextConfig,
    webpack(config, options) {
      if (!options.isServer) {
        config.plugins.push(
          new LicensePlugin({
            outputFilename: `static/licenses-${hash}.json`,
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
          "next-license-list-file": join(
            dirname(fileURLToPath(import.meta.url)),
            "null.json",
          ),
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
            "next-license-list-file": `${outputPath}/static/licenses-${hash}.json`,
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
