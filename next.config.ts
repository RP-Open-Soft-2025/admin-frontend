import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})
		return config
	},
	experimental: {
		turbo: {
			rules: {
				'*.svg': ['@svgr/webpack'],
			},
		},
	},
}

export default nextConfig
