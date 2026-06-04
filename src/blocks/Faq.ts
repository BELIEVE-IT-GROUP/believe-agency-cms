import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    flowbiteTemplateField('faq'),
    flowbiteAppearanceField(),
    { name: 'headline', type: 'text', label: 'Título de sección' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Preguntas y respuestas',
      fields: [
        { name: 'question', type: 'text', required: true, label: 'Pregunta' },
        { name: 'answer', type: 'richText', required: true, label: 'Respuesta' },
      ],
    },
  ],
}
