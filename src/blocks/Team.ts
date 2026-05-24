import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'team',
  labels: { singular: 'Equipo', plural: 'Equipo' },
  fields: [
    { name: 'headline', type: 'text', label: 'Título de sección' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'members',
      type: 'array',
      required: true,
      label: 'Miembros',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Nombre' },
        { name: 'role', type: 'text', required: true, label: 'Cargo' },
        { name: 'bio', type: 'textarea', label: 'Bio corta' },
        { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
        {
          name: 'social',
          type: 'group',
          label: 'Redes sociales',
          fields: [
            { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
            { name: 'twitter', type: 'text', label: 'X/Twitter URL' },
            { name: 'instagram', type: 'text', label: 'Instagram URL' },
          ],
        },
      ],
    },
  ],
}
