import type { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Precios', plural: 'Precios' },
  fields: [
    { name: 'headline', type: 'text', label: 'Título' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'plans',
      type: 'array',
      required: true,
      label: 'Planes',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Nombre del plan' },
        { name: 'price', type: 'text', required: true, label: 'Precio (ej: $99/mes)' },
        { name: 'description', type: 'textarea', label: 'Descripción corta' },
        { name: 'features', type: 'array', label: 'Características incluidas', fields: [{ name: 'feature', type: 'text', required: true }] },
        { name: 'notIncluded', type: 'array', label: 'No incluido', fields: [{ name: 'feature', type: 'text', required: true }] },
        { name: 'ctaText', type: 'text', label: 'Texto del botón' },
        { name: 'ctaUrl', type: 'text', label: 'URL del botón' },
        { name: 'highlighted', type: 'checkbox', label: 'Destacado (más popular)', defaultValue: false },
        { name: 'badge', type: 'text', label: 'Badge (ej: Más popular)' },
      ],
    },
  ],
}
