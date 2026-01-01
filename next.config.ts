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
		],
	},
	// Exclude global-error from static generation
	experimental: {
		staticGenerationRetryCount: 0,
	},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
