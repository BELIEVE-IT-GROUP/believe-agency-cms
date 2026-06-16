import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const CaseStudiesBlock: Block = {
  slug: 'case-studies',
  labels: { singular: 'Case Studies', plural: 'Case Studies' },
  fields: [
    flowbiteTemplateField('case-studies'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    { name: 'disclaimer', type: 'text', label: 'Disclaimer' },
    {
      name: 'cases',
      type: 'array',
      label: 'Casos',
      fields: [
        { name: 'industry', type: 'text', label: 'Industria' },
        { name: 'problem', type: 'textarea', label: 'Problema' },
        { name: 'solution', type: 'textarea', label: 'Solución' },
        {
          name: 'results',
          type: 'array',
          label: 'Resultados',
          fields: [
            { name: 'value', type: 'text', label: 'Valor' },
            { name: 'label', type: 'text', label: 'Etiqueta' },
          ],
        },
      ],
    },
  ],
}
