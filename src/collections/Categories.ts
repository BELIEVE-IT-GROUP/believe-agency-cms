import type { CollectionConfig } from 'payload'
import { byTenant } from '../access/byTenant.ts'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Contenido',
  },
  access: {
    read: () => true,
    create: byTenant,
    update: byTenant,
    delete: byTenant,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nombre' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug' },
    { name: 'description', type: 'textarea', label: 'Descripción' },
  ],
}
