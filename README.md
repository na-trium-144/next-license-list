# next-license-list

[![NPM Version](https://img.shields.io/npm/v/next-license-list)](https://www.npmjs.com/package/next-license-list)
[![Next.js 13, 14, 15, 16](https://img.shields.io/badge/Next.js-13%20%7C%2014%20%7C%2015%20%7C%2016-blue?logo=nextdotjs)](https://github.com/na-trium-144/next-license-list/actions/workflows/test-next-fixtures.yml)
[![NPM License](https://img.shields.io/npm/l/next-license-list)](https://github.com/na-trium-144/next-license-list/blob/main/LICENSE)

Get list of licenses for third-party packages using in Next.js.

## Why

In modern web development using frameworks like Next.js, you include a vast number of licenses (such as MIT and Apache) behind the scenes, in addition to the code you write. These often include the condition that **"the copyright notice and the full license text must be included in the distribution."** For websites, since the browser downloads and executes the JS file, this constitutes "software distribution."

This library allows you to easily retrieve the license information (including name, source code URL, and license text) for all libraries included in the client-side bundle of a website built with Next.js. Unlike other tools that simply output as txt or json files, this library allows you to **format and display the license information** within your website to match your website's style.

## Usage

> [!WARNING]
> This library only works with webpack. Next.js 16 uses turbopack by default, so please specify `--webpack` option.

Install from npm:
```bash
npm install next-license-list
```

This library uses [webpack-license-plugin](https://github.com/codepunkt/webpack-license-plugin) under the hood. Please refer to its README for options and other details.

Setup `next-license-list` in next.config.js:

```ts
import { withLicense } from "next-license-list/config";
import { fileURLToPath } from "node:url";

const nextConfig = {
  // your config
};

export default withLicense(nextConfig, {
  // put additional options for webpack-license-plugin here like:
  includePackages: () =>
    ["tailwindcss", "daisyui"].map((pkg) =>
      dirname(fileURLToPath(import.meta.resolve(`${pkg}/package.json`))),
    ),
});
```

The license list can be retrieved using `await getLicenses()` in server component:
```tsx
import { getLicenses } from "next-license-list";

export default async function LicensePage() {
  const licenses = await getLicenses();
  return (
    <div>
      <p>This website uses the following third-party packages:</p>
      <ul>
        {licenses.map((pkg, i) => <li key={i}>{pkg.name}</li>)}
      </ul>
    </div>
  );
}
```

`getLicenses()` works even in projects using `output: "export"`, as long as it's called from a server component.

Additionally, this library corrects the repository URL of each package to a canonical URL that starts with https. This function can be imported as `normalizeRepositoryURL()` and used separately.
(`getLicenses()` automatically do this.)

```ts
import { normalizeRepositoryURL, LicenseEntry } from "next-license-list";

const res = await fetch("/my-oss-licenses.json");
let licenses = await res.json() as LicenseEntry[];
licenses = licenses.map((e) => normalizeRepositoryURL(e));
```
