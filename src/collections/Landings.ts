import type { CollectionConfig } from 'payload'

// Landings standalone (caso birdman): el diseno vive en el front (page.tsx + content.ts),
// aca el tenant edita el contenido. content = JSON que mapea 1:1 a content.ts; el front
// hace deepMerge sobre su default. Tabla minima (sin multi-tenant plugin: tenant manual)
// para que el schema sea trivial y aplicable por SQL/migracion sin tocar el resto.
export const Landings: CollectionConfig = {
  slug: 'landings',
  admin: { useAsTitle: 'slug' },
  access: {
    read: () => true, // lectura publica; el front filtra por tenant en la query
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', index: true },
    { name: 'slug', type: 'text', required: true, index: true },
    { name: 'title', type: 'text' },
    {
      name: 'content',
      type: 'json',
      admin: { description: 'Contenido editable de la landing (JSON; mapea a content.ts del front).' },
    },
  ],
}
