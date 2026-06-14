import type { Access, Where } from 'payload'

function getUserTenantIds(user: NonNullable<Parameters<Access>[0]['req']['user']>) {
  return (
    user.tenants
      ?.map((item) => (typeof item.tenant === 'object' ? item.tenant.id : item.tenant))
      .filter((id): id is number => typeof id === 'number') || []
  )
}

function tenantWhere(tenantIds: number[]): Where | false {
  if (!tenantIds.length) return false
  if (tenantIds.length === 1) return { tenant: { equals: tenantIds[0] } } as Where
  return { tenant: { in: tenantIds } } as Where
}

export const byTenant: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('super-admin')) return true

  return tenantWhere(getUserTenantIds(user))
}

export const byTenantOrPublished: Access = ({ req: { user } }) => {
  if (user?.roles?.includes('super-admin')) return true

  const tenantIds = user ? getUserTenantIds(user) : []
  const tenantAccess = tenantWhere(tenantIds)

  if (tenantAccess) {
    return tenantAccess
  }

  return { _status: { equals: 'published' } } as Where
}
