// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // optional: exclude svg from asset rule if present
    const fileLoaderRule = config.module.rules.find(
      (rule: any) => rule.test && rule.test.test && rule.test.test(".svg")
    );
    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i;

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: { svgo: true, titleProp: true, ref: true },
        },
      ],
    });

    return config;
  },
  serverExternalPackages: ["pdfkit"],
  reactStrictMode: true,
  typedRoutes: true,
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
