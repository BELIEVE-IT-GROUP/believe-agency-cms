import { getPayload } from 'payload'

import config from '../src/payload.config.ts'

const tenantSlug = process.env.BOOTSTRAP_TENANT_SLUG || process.env.NEXT_PUBLIC_TENANT_SLUG
const siteName = process.env.BOOTSTRAP_SITE_NAME || process.env.NEXT_PUBLIC_SITE_NAME || tenantSlug
const domain = process.env.BOOTSTRAP_SITE_DOMAIN || process.env.NEXT_PUBLIC_SITE_DOMAIN || ''
const previewUrl = process.env.BOOTSTRAP_PREVIEW_URL || process.env.NEXT_PUBLIC_PREVIEW_URL || ''
const revalidateWebhookUrl =
  process.env.BOOTSTRAP_REVALIDATE_WEBHOOK_URL ||
  process.env.PAYLOAD_REVALIDATE_WEBHOOK_URL ||
  (previewUrl ? `${previewUrl.replace(/\/$/, '')}/api/revalidate` : '')

async function run() {
  if (!tenantSlug) {
    throw new Error('Define BOOTSTRAP_TENANT_SLUG or NEXT_PUBLIC_TENANT_SLUG.')
  }

  if (!siteName) {
    throw new Error('Define BOOTSTRAP_SITE_NAME or NEXT_PUBLIC_SITE_NAME.')
  }

  const payload = await getPayload({ config })

  try {
    const tenants = await payload.find({
      collection: 'tenants',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: { equals: tenantSlug },
      },
    })

    const tenant = tenants.docs[0]
    if (!tenant) {
      throw new Error(`Tenant not found for slug "${tenantSlug}".`)
    }

    const existing = await payload.find({
      collection: 'settings',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        tenant: { equals: tenant.id },
      },
    })

    const data = {
      tenant: tenant.id,
      siteName,
      domain: domain || tenant.domain || '',
      previewUrl,
      revalidateWebhookUrl,
      header: {
        templateId: 'header.default' as const,
        navLinks: [
          { label: 'Inicio', url: '/' },
          { label: 'Blog', url: '/blog' },
          { label: 'Contacto', url: '/contacto' },
        ],
        cta: {
          label: 'Hablemos',
          url: '/contacto',
        },
      },
      footer: {
        templateId: 'footer.default' as const,
        text: `© ${new Date().getFullYear()} ${siteName}. Todos los derechos reservados.`,
        links: [
          { label: 'Inicio', url: '/', group: 'Sitio' },
          { label: 'Blog', url: '/blog', group: 'Sitio' },
          { label: 'Contacto', url: '/contacto', group: 'Sitio' },
        ],
      },
      theme: {
        primaryColor: tenant.primaryColor || '#2563EB',
        accentColor: tenant.accentColor || '#0F766E',
      },
      contact: {
        defaultDestinationEmail:
          process.env.BOOTSTRAP_CONTACT_EMAIL ||
          process.env.DEFAULT_CONTACT_EMAIL ||
          '',
        publicEmail:
          process.env.BOOTSTRAP_PUBLIC_EMAIL ||
          process.env.DEFAULT_CONTACT_EMAIL ||
          '',
      },
      newsletter: {
        listId: process.env.PLUNK_NEWSLETTER_LIST_ID || '',
        successMessage: 'Suscripción recibida. Gracias.',
      },
    }

    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'settings',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
      console.log(`[bootstrap-settings] Updated settings ${updated.id} for ${tenantSlug}`)
    } else {
      const created = await payload.create({
        collection: 'settings',
        data,
        overrideAccess: true,
      })
      console.log(`[bootstrap-settings] Created settings ${created.id} for ${tenantSlug}`)
    }
  } finally {
    await payload.destroy()
  }
}

export async function script() {
  await run()
}

if (process.argv[1]?.endsWith('bootstrap-settings.ts')) {
  run().catch((error) => {
    console.error('[bootstrap-settings]', error)
    process.exit(1)
  })
}
