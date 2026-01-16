import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	reactStrictMode: true,
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
