import type { CollectionAfterChangeHook } from 'payload'

type RevalidatableCollection = 'pages' | 'posts' | 'settings'

type RevalidatePayload = {
  collection: RevalidatableCollection
  paths: string[]
  tags: string[]
  tenantId?: string
  slug?: string
}

export function revalidateFrontend(collection: RevalidatableCollection): CollectionAfterChangeHook {
  return async ({ doc, req }) => {
    const secret = process.env.PAYLOAD_REVALIDATE_SECRET ?? process.env.REVALIDATE_SECRET
    if (!secret) {
      req.payload.logger.warn('[revalidate] Missing PAYLOAD_REVALIDATE_SECRET/REVALIDATE_SECRET')
      return doc
    }

    const payload = buildRevalidatePayload(collection, doc)
    const webhookUrl = await resolveWebhookUrl({ collection, doc, req, tenantId: payload.tenantId })

    if (!webhookUrl) {
      req.payload.logger.warn(`[revalidate] Missing frontend webhook URL for ${collection}`)
      return doc
    }

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, ...payload }),
      })

      if (!res.ok) {
        req.payload.logger.warn(`[revalidate] ${webhookUrl} returned ${res.status}`)
      }
    } catch (error) {
      req.payload.logger.warn(`[revalidate] Failed to call frontend webhook: ${String(error)}`)
    }

    return doc
  }
}

function buildRevalidatePayload(collection: RevalidatableCollection, doc: any): RevalidatePayload {
  const slug = typeof doc?.slug === 'string' ? doc.slug : undefined
  const tenantId = getTenantId(doc)

  if (collection === 'pages') {
    const path = !slug || slug === 'home' || slug === '/' ? '/' : `/${slug}`
    return {
      collection,
      paths: [path],
      tags: ['payload_pages'],
      tenantId,
      slug,
    }
  }

  if (collection === 'posts') {
    return {
      collection,
      paths: slug ? ['/blog', `/blog/${slug}`] : ['/blog'],
      tags: ['payload_posts'],
      tenantId,
      slug,
    }
  }

  return {
    collection,
    paths: ['/'],
    tags: ['payload_settings'],
    tenantId,
  }
}

async function resolveWebhookUrl({
  collection,
  doc,
  req,
  tenantId,
}: {
  collection: RevalidatableCollection
  doc: any
  req: Parameters<CollectionAfterChangeHook>[0]['req']
  tenantId?: string
}) {
  if (collection === 'settings' && typeof doc?.revalidateWebhookUrl === 'string') {
    return doc.revalidateWebhookUrl
  }

  if (tenantId) {
    try {
      const result = await req.payload.find({
        collection: 'settings' as any,
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          tenant: { equals: tenantId },
        },
      })

      const settings = result.docs?.[0] as any
      if (settings?.revalidateWebhookUrl) {
        return settings.revalidateWebhookUrl as string
      }
      if (settings?.previewUrl) {
        return toRevalidateUrl(settings.previewUrl as string)
      }
    } catch (error) {
      req.payload.logger.warn(`[revalidate] Could not read settings: ${String(error)}`)
    }
  }

  if (process.env.PAYLOAD_REVALIDATE_WEBHOOK_URL) {
    return process.env.PAYLOAD_REVALIDATE_WEBHOOK_URL
  }

  if (process.env.NEXT_PUBLIC_PREVIEW_URL) {
    return toRevalidateUrl(process.env.NEXT_PUBLIC_PREVIEW_URL)
  }

  return undefined
}

function getTenantId(doc: any) {
  const tenant = doc?.tenant
  if (!tenant) return undefined
  if (typeof tenant === 'string' || typeof tenant === 'number') return String(tenant)
  if (typeof tenant === 'object' && tenant.id) return String(tenant.id)
  return undefined
}

function toRevalidateUrl(baseUrl: string) {
  return `${baseUrl.replace(/\/$/, '')}/api/revalidate`
}
