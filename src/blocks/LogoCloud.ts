import type { Block } from 'payload'

export const LogoCloudBlock: Block = {
  slug: 'logo-cloud',
  labels: { singular: 'Logo Cloud', plural: 'Logo Clouds' },
  fields: [
    { name: 'headline', type: 'text', label: 'Título (ej: "Confían en nosotros")' },
    {
      name: 'logos',
      type: 'array',
      required: true,
      label: 'Logos',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Logo' },
        { name: 'alt', type: 'text', required: true, label: 'Nombre de la empresa' },
        { name: 'url', type: 'text', label: 'URL (opcional)' },
      ],
    },
    { name: 'animate', type: 'checkbox', label: 'Animación marquee (scroll infinito)', defaultValue: false },
  ],
}
