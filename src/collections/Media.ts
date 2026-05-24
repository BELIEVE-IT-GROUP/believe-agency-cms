import type { CollectionConfig } from 'payload'
import { byTenant } from '../access/byTenant'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  admin: {
    group: 'Contenido',
  },
  access: {
    read: () => true,
    create: byTenant,
    update: byTenant,
    delete: byTenant,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Pie de imagen',
    },
  ],
}
