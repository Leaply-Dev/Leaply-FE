import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	output: "standalone",
	reactStrictMode: true,
	skipTrailingSlashRedirect: true,
	async rewrites() {
		// Same-origin proxy to the Python backend so the session cookie stays
		// same-site (no cross-origin CORS/SameSite issues in dev). Override the
		// backend host with BACKEND_URL.
		const backend = process.env.BACKEND_URL || "http://localhost:8000";
		return [
			{
				source: "/api/:path*",
				destination: `${backend}/api/:path*`,
			},
			{
				source: "/media/:path*",
				destination: `${backend}/media/:path*`,
			},
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "logo.clearbit.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**.vcos.cloudstorage.com.vn",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "drive.google.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	experimental: {
		optimizePackageImports: ["lucide-react", "framer-motion"],
	},
};

const withNextIntl = createNextIntlPlugin();
const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === "true",
});

export default withNextIntl(withBundleAnalyzer(nextConfig));
