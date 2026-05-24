import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
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
      favicon: '/favicon.ico',
    },
    components: {
      graphics: {
        Logo: '/src/components/Logo',
        Icon: '/src/components/Icon',
      },
    },
  },

  collections: [Users, Tenants, Media, Pages, Posts, Categories],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI!,
    },
  }),

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

  plugins: [
    multiTenantPlugin({
      collections: {
        pages: {},
        posts: {},
        media: {},
        categories: {},
      },
      tenantsArrayFieldName: 'tenants',
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
