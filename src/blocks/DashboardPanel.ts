import type { Block } from 'payload'
import { flowbiteAppearanceField, flowbiteTemplateField } from '../flowbite/payloadFields.ts'

export const DashboardPanelBlock: Block = {
  slug: 'dashboard-panel',
  labels: { singular: 'Dashboard Panel', plural: 'Dashboard Panels' },
  fields: [
    flowbiteTemplateField('dashboard-panel'),
    flowbiteAppearanceField(),
    { name: 'title', type: 'text', label: 'Título del panel' },
    { name: 'live', type: 'checkbox', label: 'En vivo', defaultValue: false },
    {
      name: 'kpis',
      type: 'array',
      label: 'KPIs',
      fields: [
        { name: 'label', type: 'text', label: 'Etiqueta' },
        { name: 'value', type: 'text', label: 'Valor' },
        { name: 'delta', type: 'text', label: 'Delta' },
        {
          name: 'deltaDir',
          type: 'select',
          label: 'Dirección del delta',
          options: [
            { label: 'Arriba', value: 'up' },
            { label: 'Abajo', value: 'down' },
            { label: 'Alerta', value: 'warn' },
          ],
        },
      ],
    },
    { name: 'chartLabel', type: 'text', label: 'Etiqueta del gráfico' },
    { name: 'chartDelta', type: 'text', label: 'Delta del gráfico' },
    {
      name: 'chartTone',
      type: 'select',
      label: 'Tono del gráfico',
      options: [
        { label: 'Costo', value: 'cost' },
        { label: 'Entrega', value: 'delivery' },
      ],
    },
    {
      name: 'tracking',
      type: 'array',
      label: 'Tracking',
      fields: [
        { name: 'id', type: 'text', label: 'ID' },
        { name: 'dest', type: 'text', label: 'Destino' },
        { name: 'status', type: 'text', label: 'Estado' },
        {
          name: 'statusType',
          type: 'select',
          label: 'Tipo de estado',
          options: [
            { label: 'OK', value: 'ok' },
            { label: 'Go', value: 'go' },
          ],
        },
      ],
    },
  ],
}
