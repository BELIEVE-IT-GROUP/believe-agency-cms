import type { CollectionConfig } from 'payload'
import { byTenant, byTenantOrPublished } from '../access/byTenant.ts'
import { revalidateFrontend } from '../hooks/revalidateFrontend.ts'

export const Posts: CollectionConfig = {
  slug: 'posts',
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
    { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug' },
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
