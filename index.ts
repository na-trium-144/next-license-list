export async function getLicenses() {
  // @ts-ignore
  const data = (await import("next-license-list-file")).default;
  if (data === null) {
    throw new Error("getLicenses() cannot be used in client component");
  }
  return (data as LicenseEntry[]).map((e) => normalizeRepositoryURL(e));
}

export interface LicenseEntry {
  /**
   * package name
   */
  name: string;
  /**
   * package version
   */
  version: string;
  /**
   * author listed in package.json
   */
  author?: string;
  /**
   * repository url listed in package.json
   */
  repository?: string;
  /**
   * package tarball url on npm registry
   */
  source: string;
  /**
   * the license listed in package.json.
   * If this is not a valid spdx license expression, this plugin will inform you.
   * You can then inform the package maintainers about this problem and temporarily workaround this issue with the licenseOverrides option for the specific combination of package name and version.
   */
  license: string;
  /**
   * the license text read from a file matching /^licen[cs]e/i in the package's root
   */
  licenseText?: string;
  /**
   * if includeNoticeText option is set:
   * the notice text read from a file matching /^notice/i in the package's root
   */
  noticeText?: string;
}

/**
 * Correct the repository URL to a canonical URL that starts with https.
 */
export function normalizeRepositoryURL(entry: LicenseEntry) {
  if (entry.repository) {
    let url = entry.repository;
    if (url.startsWith("http")) {
      url = entry.repository;
    } else if (url.startsWith("git+http")) {
      url = url.slice(4);
    } else if (url.startsWith("git://")) {
      url = "https://" + url.slice(6);
    } else if (url.startsWith("git@")) {
      url =
        "https://" +
        url
          .slice(4)
          .replace(":", "/")
          .replace(/\.git$/, "");
    } else if (/^github:[\w-]+\/[\w-]+$/.test(url)) {
      url = `https://github.com/${url.slice(7)}`;
    } else if (/^[\w-]+\/[\w-]+$/.test(url)) {
      // assume github username/repository
      url = `https://github.com/${url}`;
    }
    return { ...entry, repository: url };
  }
  return entry;
}
