import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const BenefitsGridBlock: Block = {
  slug: 'benefits-grid',
  labels: { singular: 'Benefits Grid', plural: 'Benefits Grids' },
  fields: [
    flowbiteTemplateField('benefits-grid'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    {
      name: 'items',
      type: 'array',
      label: 'Beneficios',
      fields: [
        { name: 'label', type: 'text', label: 'Etiqueta' },
        { name: 'description', type: 'text', label: 'Descripción' },
        {
          name: 'direction',
          type: 'select',
          label: 'Dirección',
          options: [
            { label: 'Arriba', value: 'up' },
            { label: 'Abajo', value: 'down' },
          ],
        },
      ],
    },
  ],
}
