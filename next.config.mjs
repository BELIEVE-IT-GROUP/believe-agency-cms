import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  serverExternalPackages: [
    'sharp',
    '@payloadcms/next',
    '@payloadcms/plugin-multi-tenant',
    '@payloadcms/storage-s3',
    '@payloadcms/email-nodemailer',
    'nodemailer',
    '@aws-sdk/client-s3',
  ],
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle CSS imports from external packages (@payloadcms/next deps like react-image-crop)
      // that Node.js can't process at runtime when those packages are external
      config.module.rules.push({
        test: /\.css$/,
        include: /node_modules/,
        use: ['null-loader'],
      })
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
