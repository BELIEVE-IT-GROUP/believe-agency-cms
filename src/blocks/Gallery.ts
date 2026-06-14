import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const GalleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Galería', plural: 'Galerías' },
  fields: [
    flowbiteTemplateField('gallery'),
    flowbiteAppearanceField(),
    { name: 'headline', type: 'text', label: 'Título' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'masonry',
      options: [
        { label: 'Masonry', value: 'masonry' },
        { label: 'Grid uniforme', value: 'grid' },
        { label: 'Carrusel', value: 'carousel' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      label: 'Imágenes',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', label: 'Caption' },
      ],
    },
  ],
}
