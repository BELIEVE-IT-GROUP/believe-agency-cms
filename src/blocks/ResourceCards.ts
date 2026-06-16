import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const ResourceCardsBlock: Block = {
  slug: 'resource-cards',
  labels: { singular: 'Resource Cards', plural: 'Resource Cards' },
  fields: [
    flowbiteTemplateField('resource-cards'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    {
      name: 'items',
      type: 'array',
      label: 'Recursos',
      fields: [
        { name: 'type', type: 'text', label: 'Tipo' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'description', type: 'text', label: 'Descripción' },
        { name: 'ctaText', type: 'text', label: 'Texto del botón' },
        { name: 'url', type: 'text', label: 'URL' },
      ],
    },
  ],
}
