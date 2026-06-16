import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    flowbiteTemplateField('cta'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'banner',
      options: [
        { label: 'Banner full-width', value: 'banner' },
        { label: 'Card centrada', value: 'card' },
        { label: 'Split (texto + form)', value: 'split' },
      ],
    },
    {
      name: 'ctas',
      type: 'array',
      label: 'Botones',
      maxRows: 2,
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'style', type: 'select', defaultValue: 'primary', options: ['primary', 'secondary', 'outline'].map(v => ({ label: v, value: v })) },
      ],
    },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media', label: 'Imagen de fondo (opcional)' },
    { name: 'formEnabled', type: 'checkbox', label: 'Habilitar formulario' },
    {
      name: 'formFields',
      type: 'array',
      label: 'Campos del formulario',
      fields: [
        { name: 'fieldName', type: 'text', label: 'Nombre del campo' },
        { name: 'label', type: 'text', label: 'Etiqueta' },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Texto', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Teléfono', value: 'tel' },
            { label: 'Área de texto', value: 'textarea' },
          ],
        },
        { name: 'required', type: 'checkbox', label: 'Requerido' },
        { name: 'placeholder', type: 'text', label: 'Placeholder' },
      ],
    },
    { name: 'formDestinationEmail', type: 'email', label: 'Email destino del formulario' },
  ],
}
