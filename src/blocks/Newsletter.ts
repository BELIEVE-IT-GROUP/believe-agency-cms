import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const NewsletterBlock: Block = {
  slug: 'newsletter',
  labels: { singular: 'Newsletter', plural: 'Newsletters' },
  fields: [
    flowbiteTemplateField('newsletter'),
    flowbiteAppearanceField(),
    { name: 'headline', type: 'text', required: true, label: 'Título' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    { name: 'placeholder', type: 'text', defaultValue: 'tu@email.com', label: 'Placeholder del input' },
    { name: 'ctaText', type: 'text', defaultValue: 'Suscribirme', label: 'Texto del botón' },
    { name: 'successMessage', type: 'text', defaultValue: '¡Suscrito! Gracias.', label: 'Mensaje de éxito' },
    { name: 'destinationEmail', type: 'email', label: 'Email destino (backup, además de lista)' },
  ],
}
