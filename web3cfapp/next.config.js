/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				crypto: false,
			};
		}

		// Ignore pino-pretty in client-side builds
		config.resolve.alias = {
			...config.resolve.alias,
			"pino-pretty": false,
		};

		return config;
	},
};

module.exports = nextConfig;
