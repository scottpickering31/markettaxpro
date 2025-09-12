// next.config.ts
import type { NextConfig } from "next";
import type { Configuration, RuleSetRule } from "webpack";

function isRegexRule(
  rule: RuleSetRule
): rule is RuleSetRule & { test: RegExp } {
  return !!rule && rule.test instanceof RegExp;
}

const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    const rule = config.module?.rules?.find(
      (r): r is RuleSetRule & { test: RegExp } =>
        typeof r === "object" &&
        r !== null &&
        isRegexRule(r) &&
        r.test.test(".svg")
    );

    if (rule) {
      rule.exclude = /\.svg$/i;
    }

    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  serverExternalPackages: ["pdfkit"],
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
