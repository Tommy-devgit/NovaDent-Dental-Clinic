import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@novadent/database", "@novadent/types", "@novadent/validations", "@novadent/utils", "@novadent/ui"],
};

export default nextConfig;
