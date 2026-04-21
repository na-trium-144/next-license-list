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
