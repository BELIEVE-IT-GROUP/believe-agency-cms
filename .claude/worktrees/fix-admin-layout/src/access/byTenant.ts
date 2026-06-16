import type { Access, Where } from 'payload'

export const byTenant: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('super-admin')) return true

  const tenantId = user.lastLoggedInTenant?.id ?? user.lastLoggedInTenant
  if (!tenantId) return false

  return { tenant: { equals: tenantId } } as Where
}

export const byTenantOrPublished: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('super-admin')) return true

  const tenantId = user?.lastLoggedInTenant?.id ?? user?.lastLoggedInTenant

  if (tenantId) {
    return { tenant: { equals: tenantId } } as Where
  }

  return { _status: { equals: 'published' } } as Where
}
