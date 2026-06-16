import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: { singular: 'Features', plural: 'Features' },
  fields: [
    flowbiteTemplateField('features'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', label: 'Título de sección' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 3 columnas', value: 'grid-3' },
        { label: 'Grid 2 columnas', value: 'grid-2' },
        { label: 'Lista con icono', value: 'list' },
        { label: 'Alternado (imagen + texto)', value: 'alternating' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Features',
      fields: [
        { name: 'icon', type: 'text', label: 'Icono (nombre Heroicons o emoji)' },
        { name: 'title', type: 'text', required: true, label: 'Título' },
        { name: 'description', type: 'textarea', required: true, label: 'Descripción' },
        { name: 'code', type: 'text', label: 'Código (snippet o referencia)' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Imagen (para layout alternating)' },
      ],
    },
  ],
}
