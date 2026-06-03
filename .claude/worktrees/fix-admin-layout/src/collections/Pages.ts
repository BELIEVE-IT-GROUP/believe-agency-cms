import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'
import { byTenant, byTenantOrPublished } from '../access/byTenant'

export const Pages: CollectionConfig = {
  slug: 'pages',
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
      unique: true,
      label: 'Slug',
      admin: { description: 'URL: /slug. Usa "/" para la home.' },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Bloques de contenido',
      blocks: allBlocks,
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta título' },
        { name: 'description', type: 'textarea', label: 'Meta descripción' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'OG Image' },
      ],
    },
  ],
}
