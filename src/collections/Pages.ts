import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks/index.ts'
import { byTenant, byTenantOrPublished } from '../access/byTenant.ts'
import { revalidateFrontend } from '../hooks/revalidateFrontend.ts'

export const Pages: CollectionConfig = {
  slug: 'pages',
  // Slug unique per (tenant, slug) so each tenant can have its own 'home'.
  // 'tenant' field is injected by the multi-tenant plugin.
  indexes: [{ fields: ['tenant', 'slug'], unique: true }],
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    defaultColumns: ['title', 'slug', '_status'],
    preview: (doc) => {
      if (!doc?.slug) return null
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/preview/pages/${doc.slug}`
    },
  },
  versions: { drafts: { autosave: true } },
  hooks: {
    afterChange: [revalidateFrontend('pages')],
  },
  access: {
    read: byTenantOrPublished,
    create: byTenant,
    update: byTenant,
    delete: byTenant,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Título de la página' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug',
      admin: { description: 'URL: /slug. Usa "/" para la home.' },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Bloques de contenido',
      blocks: allBlocks,
    },
    // SEO fields are provided by @payloadcms/plugin-seo (the 'meta' group).
  ],
}
