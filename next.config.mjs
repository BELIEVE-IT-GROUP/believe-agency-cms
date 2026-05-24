import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  serverExternalPackages: [
    'sharp',
    'payload',
    '@payloadcms/db-postgres',
    '@payloadcms/plugin-multi-tenant',
    '@payloadcms/storage-s3',
    '@payloadcms/email-nodemailer',
    'nodemailer',
    '@aws-sdk/client-s3',
  ],
  eslint: { ignoreDuringBuilds: true },
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
