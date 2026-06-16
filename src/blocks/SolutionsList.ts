import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const SolutionsListBlock: Block = {
  slug: 'solutions-list',
  labels: { singular: 'Solutions List', plural: 'Solutions Lists' },
  fields: [
    flowbiteTemplateField('solutions-list'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    {
      name: 'items',
      type: 'array',
      label: 'Soluciones',
      fields: [
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'body', type: 'textarea', label: 'Descripción' },
        {
          name: 'chips',
          type: 'array',
          label: 'Chips',
          fields: [{ name: 'label', type: 'text', label: 'Etiqueta' }],
        },
      ],
    },
  ],
}
