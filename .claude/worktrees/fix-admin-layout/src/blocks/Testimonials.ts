import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonios', plural: 'Testimonios' },
  fields: [
    { name: 'headline', type: 'text', label: 'Título de sección' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carrusel', value: 'carousel' },
        { label: 'Masonry', value: 'masonry' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Testimonios',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Nombre' },
        { name: 'role', type: 'text', label: 'Cargo' },
        { name: 'company', type: 'text', label: 'Empresa' },
        { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
        { name: 'quote', type: 'textarea', required: true, label: 'Testimonio' },
        { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5, label: 'Rating (1-5)' },
      ],
    },
  ],
}
