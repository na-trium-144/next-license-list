import { withLicense } from "next-license-list/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

export default withLicense(nextConfig, {});
