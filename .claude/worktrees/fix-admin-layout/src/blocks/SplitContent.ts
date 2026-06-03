import type { Block } from 'payload'

export const SplitContentBlock: Block = {
  slug: 'split-content',
  labels: { singular: 'Split Content', plural: 'Split Contents' },
  fields: [
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
  ],
}
