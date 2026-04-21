# next-license-list

Get list of third-party package licenses used in Next.js.

## Usage

This library uses [webpack-license-plugin](https://github.com/codepunkt/webpack-license-plugin) under the hood. Please refer to its README for options and other details.

Setup `next-license-list` in next.config.js:

```ts
import { withLicense } from "next-license-list/config";

const nextConfig = {
  // your config
};

export default withLicense(nextConfig, {
  /*
  put additional options for webpack-license-plugin here like:

  includePackages: () =>
    ["tailwindcss", "daisyui"].map((pkg) =>
      dirname(import.meta.resolve(`${pkg}/package.json`))
    ),
  */
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
      <ul>
        {licenses.map((pkg, i) => <li key={i}>{pkg.name}</li>)}
      </ul>
    </div>
  );
}
```

TODO: これはstatic exportでも使える? その場合 useLicenses() は必要ないのでは?
