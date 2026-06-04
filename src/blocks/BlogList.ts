import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const BlogListBlock: Block = {
  slug: 'blog-list',
  labels: { singular: 'Lista de Blog', plural: 'Listas de Blog' },
  fields: [
    flowbiteTemplateField('blog-list'),
    flowbiteAppearanceField(),
    { name: 'headline', type: 'text', label: 'Título de sección' },
    { name: 'count', type: 'number', defaultValue: 3, min: 1, max: 12, label: 'Cantidad de posts a mostrar' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid de cards', value: 'grid' },
        { label: 'Lista horizontal', value: 'list' },
        { label: 'Featured (1 grande + grid)', value: 'featured' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Ver todos (opcional)',
      fields: [
        { name: 'text', type: 'text', defaultValue: 'Ver todos los artículos' },
        { name: 'url', type: 'text', defaultValue: '/blog' },
      ],
    },
  ],
}
