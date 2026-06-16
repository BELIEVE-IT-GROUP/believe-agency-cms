import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const SavingsCalculatorBlock: Block = {
  slug: 'savings-calculator',
  labels: { singular: 'Savings Calculator', plural: 'Savings Calculators' },
  fields: [
    flowbiteTemplateField('savings-calculator'),
    flowbiteAppearanceField(),
    { name: 'eyebrow', type: 'text', label: 'Eyebrow (texto superior pequeño)' },
    { name: 'headline', type: 'text', required: true, label: 'Titular principal' },
    { name: 'lead', type: 'text', label: 'Texto introductorio' },
    {
      name: 'fields',
      type: 'array',
      label: 'Campos del cálculo',
      fields: [
        { name: 'fieldId', type: 'text', label: 'ID del campo' },
        { name: 'label', type: 'text', label: 'Etiqueta' },
        { name: 'prefix', type: 'text', label: 'Prefijo' },
        { name: 'defaultValue', type: 'text', label: 'Valor por defecto' },
        { name: 'hint', type: 'text', label: 'Ayuda' },
      ],
    },
    { name: 'rate', type: 'number', label: 'Tasa' },
    { name: 'outputAnnualLabel', type: 'text', label: 'Etiqueta resultado anual' },
    { name: 'outputSaveLabel', type: 'text', label: 'Etiqueta ahorro' },
    { name: 'ctaText', type: 'text', label: 'Texto del botón' },
    { name: 'ctaUrl', type: 'text', label: 'URL del botón' },
    { name: 'assumptionNote', type: 'text', label: 'Nota de supuestos' },
  ],
}
