import type { Block } from 'payload'

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    { name: 'headline', type: 'text', required: true, label: 'Titular' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'banner',
      options: [
        { label: 'Banner full-width', value: 'banner' },
        { label: 'Card centrada', value: 'card' },
        { label: 'Split (texto + form)', value: 'split' },
      ],
    },
    {
      name: 'ctas',
      type: 'array',
      label: 'Botones',
      maxRows: 2,
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'style', type: 'select', defaultValue: 'primary', options: ['primary', 'secondary', 'outline'].map(v => ({ label: v, value: v })) },
      ],
    },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Imagen de fondo (opcional)' },
  ],
}
