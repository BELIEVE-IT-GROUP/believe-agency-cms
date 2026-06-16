import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Contacto', plural: 'Contacto' },
  fields: [
    { name: 'headline', type: 'text', label: 'Título' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo' },
    { name: 'destinationEmail', type: 'email', required: true, label: 'Email de destino' },
    { name: 'successMessage', type: 'text', label: 'Mensaje de éxito', defaultValue: '¡Mensaje enviado! Te contactaremos pronto.' },
    {
      name: 'fields',
      type: 'array',
      label: 'Campos del formulario',
      defaultValue: [
        { fieldName: 'name', label: 'Nombre', type: 'text', required: true },
        { fieldName: 'email', label: 'Email', type: 'email', required: true },
        { fieldName: 'message', label: 'Mensaje', type: 'textarea', required: true },
      ],
      fields: [
        { name: 'fieldName', type: 'text', required: true, label: 'ID del campo' },
        { name: 'label', type: 'text', required: true, label: 'Etiqueta visible' },
        { name: 'type', type: 'select', options: ['text', 'email', 'tel', 'textarea', 'select'].map(v => ({ label: v, value: v })), defaultValue: 'text' },
        { name: 'required', type: 'checkbox', defaultValue: false, label: 'Requerido' },
        { name: 'placeholder', type: 'text', label: 'Placeholder' },
      ],
    },
  ],
}
