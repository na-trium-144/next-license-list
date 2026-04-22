import type { NextConfig } from "next";
import { withLicense } from "next-license-list/config";

const nextConfig: NextConfig = {};

export default withLicense(nextConfig, {});
