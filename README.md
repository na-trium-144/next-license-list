# next-license-list

Get list of licenses for third-party packages using in Next.js.

## Usage

This library uses [webpack-license-plugin](https://github.com/codepunkt/webpack-license-plugin) under the hood. Please refer to its README for options and other details.

This library only works with webpack. Next.js 16 uses turbopack by default, so please specify `--webpack` option.

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
