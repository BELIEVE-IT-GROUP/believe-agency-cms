import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import path from 'path'
import sharp from 'sharp'

import { Users } from './collections/Users.ts'
import { Tenants } from './collections/Tenants.ts'
import { Media } from './collections/Media.ts'
import { Pages } from './collections/Pages.ts'
import { Landings } from './collections/Landings.ts'
import { Posts } from './collections/Posts.ts'
import { Categories } from './collections/Categories.ts'
import { Settings } from './collections/Settings.ts'

const createPayloadConfig = async () => {
  const { lexicalEditor } = await import('@payloadcms/richtext-lexical')

  return buildConfig({
  bin: [
    {
      key: 'bootstrap:settings',
      scriptPath: path.resolve(process.cwd(), 'scripts/bootstrap-settings.mjs'),
    },
    {
      key: 'bootstrap:tenant-content',
      scriptPath: path.resolve(process.cwd(), 'scripts/bootstrap-tenant-content.mjs'),
    },
  ],

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Believe Agency CMS',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      url: ({ data, collectionConfig }) => {
        const base = process.env.NEXT_PUBLIC_PREVIEW_URL
        if (!base || !data?.slug) return null
        if (collectionConfig?.slug === 'pages') {
          return `${base}/api/preview?collection=pages&slug=${data.slug}`
        }
        if (collectionConfig?.slug === 'posts') {
          return `${base}/api/preview?collection=posts&slug=${data.slug}`
        }
        return null
      },
    },
  },

  collections: [Users, Tenants, Media, Pages, Landings, Posts, Categories, Settings],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
    // Auto-push schema on startup — replace with migrations once stable
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
  }),

  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM_ADDRESS ?? 'cms@believe-global.com',
          defaultFromName: process.env.SMTP_FROM_NAME ?? 'Believe Agency CMS',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT ?? 587),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : {}),

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'agency-cms/media',
          generateFileURL: ({ filename, prefix }) =>
            `${process.env.R2_PUBLIC_URL}/${prefix}/${filename}`,
        },
      },
      bucket: process.env.R2_BUCKET!,
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT!,
      },
    }),

    multiTenantPlugin({
      collections: {
        pages: {},
        landings: {},
        posts: {},
        media: {},
        categories: {},
        settings: {},
      },
      userHasAccessToAllTenants: (user) =>
        Boolean(user?.roles?.includes('super-admin')),
    }),

    seoPlugin({
      collections: ['pages', 'posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => doc?.title,
      generateDescription: ({ doc }) => doc?.excerpt || doc?.title,
    }),
  ],

  secret: process.env.PAYLOAD_SECRET!,

  sharp,

  typescript: {
    outputFile: './src/payload-types.ts',
  },
})
}

export default createPayloadConfig()
