import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Believe Agency CMS',
    },
  },

  collections: [Users, Tenants, Media, Pages, Posts, Categories],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
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
        posts: {},
        media: {},
        categories: {},
      },
      userHasAccessToAllTenants: (user) =>
        Boolean(user?.roles?.includes('super-admin')),
    }),
  ],

  secret: process.env.PAYLOAD_SECRET!,

  sharp,

  typescript: {
    outputFile: './src/payload-types.ts',
  },
})
