/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "logo.clearbit.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
