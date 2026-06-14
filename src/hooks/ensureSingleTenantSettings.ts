import type { CollectionBeforeChangeHook } from 'payload'

function getRelationId(value: unknown) {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id?: number | string }).id
  }
  return undefined
}

export const ensureSingleTenantSettings: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const tenantId = getRelationId(data?.tenant) ?? getRelationId(originalDoc?.tenant)

  if (!tenantId) {
    return data
  }

  const existing = await req.payload.find({
    collection: 'settings',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { tenant: { equals: tenantId } },
        ...(operation === 'update' && originalDoc?.id
          ? [{ id: { not_equals: originalDoc.id } }]
          : []),
      ],
    },
  })

  if (existing.docs.length) {
    throw new Error('Ya existe una configuración de sitio para este tenant.')
  }

  return data
}
