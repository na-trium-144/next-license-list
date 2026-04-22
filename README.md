# next-license-list

Get list of licenses for third-party packages using in Next.js.

## Usage

This library uses [webpack-license-plugin](https://github.com/codepunkt/webpack-license-plugin) under the hood. Please refer to its README for options and other details.

Setup `next-license-list` in next.config.js:

```ts
import { withLicense } from "next-license-list/config";

const nextConfig = {
  // your config
};

export default withLicense(nextConfig, {
  // put additional options for webpack-license-plugin here like:
  includePackages: () =>
    ["tailwindcss", "daisyui"].map((pkg) =>
      dirname(import.meta.resolve(`${pkg}/package.json`))
    ),
});
```

In server component, the license list can be retrieved using `await getLicenses()`:
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

In client component, the license list can be retrieved using `useLicenses()`, which fetches `/_next/static/licenses-(hash).json` after the component mounted:
```tsx
"use client";

import { useLicenses } from "next-license-list";

export function LicenseListComponent() {
  const licenses = useLicenses();
  return (
    <div>
      <p>This website uses the following third-party packages:</p>
      {Array.isArray(licenses) ? (
        <ul>
          {licenses.map((pkg, i) => (
            <li key={i}>{pkg.name}</li>
          ))}
        </ul>
      ) : licenses ? (
        // returns Error object on error
        <p>Error occured: {licenses}</p>
      ) : (
        // returns undefined until fetch is done
        <p>fetching...</p>
      )}
    </div>
  );
}
```

Additionally, this library corrects the repository URL of each package to a canonical URL that starts with https. This function can be imported as `normalizeRepositoryURL()` and used separately.
(`getLicenses()` and `useLicenses()` automatically do this.)

```ts
import { normalizeRepositoryURL, LicenseEntry } from "next-license-list";

const res = await fetch("/my-oss-licenses.json");
let licenses = await res.json() as LicenseEntry[];
licenses = licenses.map((e) => normalizeRepositoryURL(e));
```

## Caveats

- This library only works with webpack. Next.js 16 uses turbopack by default, so please specify `--webpack` option.
- `getLicenses()` hardcodes the absolute path of the `.next` directory at build time into the server-side bundle. It doesn't work if you move the `.next` directory after building.
