import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Estadísticas', plural: 'Estadísticas' },
  fields: [
    { name: 'headline', type: 'text', label: 'Título (opcional)' },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      label: 'Métricas',
      fields: [
        { name: 'value', type: 'text', required: true, label: 'Valor (ej: +500, 98%, $2M)' },
        { name: 'label', type: 'text', required: true, label: 'Etiqueta' },
        { name: 'description', type: 'text', label: 'Descripción corta' },
      ],
    },
  ],
}
