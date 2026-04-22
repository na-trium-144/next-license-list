import type { NextConfig } from "next";
import { withLicense } from "next-license-list/config";

const nextConfig: NextConfig = {
  output: "export",
};

export default withLicense(nextConfig, {});
