import type { CollectionConfig } from 'payload'
import { byTenant, byTenantOrPublished } from '../access/byTenant.ts'
import { revalidateFrontend } from '../hooks/revalidateFrontend.ts'

export const Posts: CollectionConfig = {
  slug: 'posts',
  // Slug unique per (tenant, slug) so two tenants can reuse the same slug.
  // 'tenant' field is injected by the multi-tenant plugin.
  indexes: [{ fields: ['tenant', 'slug'], unique: true }],
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    defaultColumns: ['title', 'category', '_status', 'publishedAt'],
  },
  versions: { drafts: { autosave: true } },
  hooks: {
    afterChange: [revalidateFrontend('posts')],
  },
  access: {
    read: byTenantOrPublished,
    create: byTenant,
    update: byTenant,
    delete: byTenant,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Título' },
    { name: 'slug', type: 'text', required: true, label: 'Slug' },
    { name: 'excerpt', type: 'textarea', label: 'Extracto' },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Imagen de portada' },
    { name: 'content', type: 'richText', required: true, label: 'Contenido' },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoría',
    },
    { name: 'publishedAt', type: 'date', label: 'Fecha de publicación' },
    { name: 'readTime', type: 'number', label: 'Tiempo de lectura (minutos)' },
    // SEO fields are provided by @payloadcms/plugin-seo (the 'meta' group).
  ],
}
