import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 días
    verify: false,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
    defaultColumns: ['email', 'name', 'roles'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('super-admin')) return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => Boolean(user?.roles?.includes('super-admin')),
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('super-admin')) return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('super-admin')),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre completo',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['tenant-editor'],
      options: [
        { label: 'Super Admin (Believe)', value: 'super-admin' },
        { label: 'Editor de Tenant', value: 'tenant-editor' },
      ],
      access: {
        update: ({ req: { user } }) => Boolean(user?.roles?.includes('super-admin')),
      },
    },
  ],
}
