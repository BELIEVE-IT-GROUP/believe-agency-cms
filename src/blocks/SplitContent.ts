import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const SplitContentBlock: Block = {
  slug: 'split-content',
  labels: { singular: 'Split Content', plural: 'Split Contents' },
  fields: [
    flowbiteTemplateField('split-content'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Título' },
    { name: 'body', type: 'richText', required: true, label: 'Contenido (richtext)' },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Imagen' },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Imagen a la derecha', value: 'right' },
        { label: 'Imagen a la izquierda', value: 'left' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Botón (opcional)',
      fields: [
        { name: 'text', type: 'text', label: 'Texto' },
        { name: 'url', type: 'text', label: 'URL' },
      ],
    },
    {
      name: 'ctas',
      type: 'array',
      label: 'Botones (múltiples, opcional)',
      fields: [
        { name: 'text', type: 'text', label: 'Texto del botón' },
        { name: 'url', type: 'text', label: 'URL' },
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Primario', value: 'primary' },
            { label: 'Secundario', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
  ],
}
