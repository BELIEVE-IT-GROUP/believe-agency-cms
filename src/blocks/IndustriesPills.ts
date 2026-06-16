import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const IndustriesPillsBlock: Block = {
  slug: 'industries-pills',
  labels: { singular: 'Industries Pills', plural: 'Industries Pills' },
  fields: [
    flowbiteTemplateField('industries-pills'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    {
      name: 'items',
      type: 'array',
      label: 'Industrias',
      fields: [{ name: 'label', type: 'text', label: 'Etiqueta' }],
    },
  ],
}
