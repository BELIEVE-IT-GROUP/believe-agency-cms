import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  serverExternalPackages: ['sharp', '@payloadcms/richtext-lexical'],
  eslint: { ignoreDuringBuilds: true },
  // Payload admin internals include Html from next/document — skip prerender failures
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'next/document']
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.believe-global.com',
      },
    ],
  },
}

export default withPayload(nextConfig)
