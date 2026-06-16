import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Steps', plural: 'Steps' },
  fields: [
    flowbiteTemplateField('steps'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Linear', value: 'linear' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Pasos',
      fields: [
        { name: 'number', type: 'text', label: 'Número' },
        { name: 'title', type: 'text', label: 'Título' },
        { name: 'description', type: 'textarea', label: 'Descripción' },
      ],
    },
  ],
}
