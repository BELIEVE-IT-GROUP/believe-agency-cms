import type { Field } from 'payload'

import {
  type FlowbiteBlockType,
  getDefaultFlowbiteTemplateId,
  getFlowbiteTemplateOptions,
} from './registry.ts'

export function flowbiteTemplateField(blockType: FlowbiteBlockType): Field {
  return {
    name: 'templateId',
    type: 'select',
    required: true,
    defaultValue: getDefaultFlowbiteTemplateId(blockType),
    label: 'Template Flowbite Pro',
    admin: {
      description:
        'Variante visual del catálogo Flowbite React Blocks que usará el frontend.',
    },
    options: getFlowbiteTemplateOptions(blockType),
  }
}

export function flowbiteAppearanceField(): Field {
  return {
    name: 'appearance',
    type: 'group',
    label: 'Apariencia',
    admin: {
      description: 'Opciones compartidas para adaptar el bloque al sitio del tenant.',
    },
    fields: [
      {
        name: 'background',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default del template', value: 'default' },
          { label: 'Blanco', value: 'white' },
          { label: 'Gris claro', value: 'gray' },
          { label: 'Primario', value: 'primary' },
          { label: 'Oscuro', value: 'dark' },
          { label: 'Imagen', value: 'image' },
        ],
      },
      {
        name: 'container',
        type: 'select',
        defaultValue: 'xl',
        options: [
          { label: 'Default del template', value: 'default' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'XL', value: 'xl' },
          { label: '2XL', value: '2xl' },
          { label: 'Full width', value: 'full' },
        ],
      },
      {
        name: 'spacingTop',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default del template', value: 'default' },
          { label: 'Ninguno', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'spacingBottom',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default del template', value: 'default' },
          { label: 'Ninguno', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'alignment',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default del template', value: 'default' },
          { label: 'Izquierda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Derecha', value: 'right' },
        ],
      },
      {
        name: 'sectionId',
        type: 'text',
        label: 'ID HTML de sección',
        admin: { description: 'Opcional. Útil para anchors y navegación.' },
      },
      {
        name: 'customClassName',
        type: 'text',
        label: 'Clase CSS opcional',
        admin: {
          description: 'Uso avanzado. El frontend puede ignorarlo si no está permitido.',
        },
      },
    ],
  }
}
