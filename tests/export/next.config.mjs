import { withLicense } from "next-license-list/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
};

export default withLicense(nextConfig, {});
