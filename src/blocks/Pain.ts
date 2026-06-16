import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const PainBlock: Block = {
  slug: 'pain',
  labels: { singular: 'Pain', plural: 'Pains' },
  fields: [
    flowbiteTemplateField('pain'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'Statement', value: 'statement' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Tarjetas de dolor',
      fields: [
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'description', type: 'textarea', label: 'Descripción' },
        { name: 'data', type: 'text', label: 'Dato (ej: 73% de los equipos)' },
      ],
    },
  ],
}
