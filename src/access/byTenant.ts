import type { Access } from 'payload'

export const byTenant: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('super-admin')) return true

  const tenantId = user.lastLoggedInTenant?.id ?? user.lastLoggedInTenant

  if (!tenantId) return false

  return {
    tenant: { equals: tenantId },
  }
}

export const byTenantOrPublished: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('super-admin')) return true

  const tenantId = user?.lastLoggedInTenant?.id ?? user?.lastLoggedInTenant

  if (tenantId) {
    return {
      or: [
        { tenant: { equals: tenantId } },
        { _status: { equals: 'published' } },
      ],
    }
  }

  return { _status: { equals: 'published' } }
}
