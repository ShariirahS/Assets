import nextConfig from "eslint-config-next";

const baseConfig = Array.isArray(nextConfig) ? nextConfig : [nextConfig];

const config = [
  ...baseConfig,
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },
];

export default config;
