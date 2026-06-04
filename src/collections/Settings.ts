import type { CollectionConfig } from 'payload'

import { byTenant } from '../access/byTenant.ts'
import { getDefaultFlowbiteTemplateId, getFlowbiteTemplateOptions } from '../flowbite/registry.ts'
import { ensureSingleTenantSettings } from '../hooks/ensureSingleTenantSettings.ts'
import { revalidateFrontend } from '../hooks/revalidateFrontend.ts'

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'siteName',
    group: 'Sistema',
    defaultColumns: ['siteName', 'domain', 'updatedAt'],
    description:
      'Configuración visual y operativa del sitio web para cada tenant.',
  },
  access: {
    read: () => true,
    create: byTenant,
    update: byTenant,
    delete: byTenant,
  },
  hooks: {
    beforeChange: [ensureSingleTenantSettings],
    afterChange: [revalidateFrontend('settings')],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      label: 'Nombre del sitio',
    },
    {
      name: 'domain',
      type: 'text',
      label: 'Dominio público',
      admin: { description: 'Ej: clientex.com' },
    },
    {
      name: 'previewUrl',
      type: 'text',
      label: 'URL de preview/frontend',
      admin: { description: 'Ej: https://clientex.com' },
    },
    {
      name: 'revalidateWebhookUrl',
      type: 'text',
      label: 'Webhook ISR del frontend',
      admin: { description: 'Ej: https://clientex.com/api/revalidate' },
    },
    {
      name: 'header',
      type: 'group',
      label: 'Header',
      fields: [
        {
          name: 'templateId',
          type: 'select',
          required: true,
          defaultValue: getDefaultFlowbiteTemplateId('header'),
          options: getFlowbiteTemplateOptions('header'),
          label: 'Template Flowbite Pro',
        },
        { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
        {
          name: 'navLinks',
          type: 'array',
          label: 'Navegación principal',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Texto' },
            { name: 'url', type: 'text', required: true, label: 'URL' },
            { name: 'newTab', type: 'checkbox', defaultValue: false, label: 'Abrir en nueva pestaña' },
          ],
        },
        {
          name: 'cta',
          type: 'group',
          label: 'Botón principal',
          fields: [
            { name: 'label', type: 'text', label: 'Texto' },
            { name: 'url', type: 'text', label: 'URL' },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      fields: [
        {
          name: 'templateId',
          type: 'select',
          required: true,
          defaultValue: getDefaultFlowbiteTemplateId('footer'),
          options: getFlowbiteTemplateOptions('footer'),
          label: 'Template Flowbite Pro',
        },
        { name: 'text', type: 'textarea', label: 'Texto del footer' },
        {
          name: 'links',
          type: 'array',
          label: 'Links del footer',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Texto' },
            { name: 'url', type: 'text', required: true, label: 'URL' },
            { name: 'group', type: 'text', label: 'Grupo/columna' },
          ],
        },
      ],
    },
    {
      name: 'theme',
      type: 'group',
      label: 'Marca y colores',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          label: 'Color primario',
          admin: { description: 'Hex. Ej: #0066FF' },
        },
        {
          name: 'accentColor',
          type: 'text',
          label: 'Color de acento',
          admin: { description: 'Hex. Ej: #FF6600' },
        },
        { name: 'defaultOgImage', type: 'upload', relationTo: 'media', label: 'OG image por defecto' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Redes sociales',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'X/Twitter', value: 'twitter' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Otro', value: 'other' },
          ],
        },
        { name: 'url', type: 'text', required: true, label: 'URL' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contacto',
      fields: [
        { name: 'defaultDestinationEmail', type: 'email', label: 'Email de destino por defecto' },
        { name: 'publicEmail', type: 'email', label: 'Email público' },
        { name: 'phone', type: 'text', label: 'Teléfono' },
        { name: 'address', type: 'textarea', label: 'Dirección' },
        { name: 'mapUrl', type: 'text', label: 'Google Maps embed URL' },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter',
      fields: [
        { name: 'listId', type: 'text', label: 'ID de lista Plunk' },
        { name: 'successMessage', type: 'text', defaultValue: '¡Suscrito! Gracias.', label: 'Mensaje de éxito' },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics',
      fields: [
        { name: 'gaMeasurementId', type: 'text', label: 'GA4 Measurement ID' },
        { name: 'googleTagManagerId', type: 'text', label: 'Google Tag Manager ID' },
        { name: 'metaPixelId', type: 'text', label: 'Meta Pixel ID' },
      ],
    },
  ],
}
