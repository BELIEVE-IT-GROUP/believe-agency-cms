import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    group: 'Sistema',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('super-admin')) return true
      return {
        id: { in: (user.tenants ?? []).map((t: any) => t.tenant?.id ?? t.tenant) },
      }
    },
    create: ({ req: { user } }) => Boolean(user?.roles?.includes('super-admin')),
    update: ({ req: { user } }) => Boolean(user?.roles?.includes('super-admin')),
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('super-admin')),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre del cliente',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (identificador único)',
      admin: { description: 'Solo minúsculas, sin espacios. Ej: cliente-x' },
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Dominio del sitio',
      admin: { description: 'Ej: clientex.com' },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'primaryColor',
      type: 'text',
      label: 'Color primario',
      admin: { description: 'Hex. Ej: #0066FF' },
    },
    {
      name: 'accentColor',
      type: 'text',
      label: 'Color de acento',
      admin: { description: 'Hex. Ej: #FF6600' },
    },
  ],
}
