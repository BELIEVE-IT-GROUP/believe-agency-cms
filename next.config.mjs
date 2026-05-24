import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for orphaned package-lock.json in $HOME confusing Next.js workspace root detection
  outputFileTracingRoot: __dirname,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.believe-global.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-8f256405c6b8438b956c0ac28e1c8f55.r2.dev',
      },
    ],
  },
}

// devBundleServerPackages: false — Payload handles server package externalization
// This prevents @payloadcms/next and dependencies from being bundled by webpack,
// which fixes the <Html> prerender error without needing document-mock hacks.
export default withPayload(nextConfig, { devBundleServerPackages: false })
