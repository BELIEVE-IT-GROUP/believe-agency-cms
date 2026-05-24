import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  serverExternalPackages: ['sharp', '@payloadcms/richtext-lexical'],
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Payload admin chunks use <Html> from next/document outside _document,
      // which crashes 404 prerender. Mock it with safe no-op equivalents.
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/document': new URL('./src/document-mock.js', import.meta.url).pathname,
      }
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
