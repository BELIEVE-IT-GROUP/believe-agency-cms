import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heros' },
  fields: [
    flowbiteTemplateField('hero'),
    flowbiteAppearanceField(),
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centrado', value: 'centered' },
        { label: 'Split (texto + imagen)', value: 'split' },
        { label: 'Video de fondo', value: 'video' },
        { label: 'Imagen de fondo', value: 'image-bg' },
      ],
    },
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'stats',
      type: 'array',
      label: 'Estadísticas destacadas',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', label: 'Valor' },
        { name: 'label', type: 'text', label: 'Etiqueta' },
      ],
    },
    {
      name: 'ctas',
      type: 'array',
      label: 'Botones de acción',
      maxRows: 3,
      fields: [
        { name: 'text', type: 'text', required: true, label: 'Texto del botón' },
        { name: 'url', type: 'text', required: true, label: 'URL' },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primario', value: 'primary' },
            { label: 'Secundario', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Imagen' },
    { name: 'videoUrl', type: 'text', label: 'URL del video (para variante video)' },
    { name: 'badge', type: 'text', label: 'Badge / etiqueta superior' },
  ],
}
