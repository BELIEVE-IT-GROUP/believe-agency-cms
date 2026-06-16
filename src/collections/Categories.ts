import type { CollectionConfig } from 'payload'
import { byTenant } from '../access/byTenant.ts'

export const Categories: CollectionConfig = {
  slug: 'categories',
  // Slug unique per (tenant, slug) so two tenants can reuse the same slug.
  // 'tenant' field is injected by the multi-tenant plugin.
  indexes: [{ fields: ['tenant', 'slug'], unique: true }],
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
    { name: 'slug', type: 'text', required: true, label: 'Slug' },
    { name: 'description', type: 'textarea', label: 'Descripción' },
  ],
}
