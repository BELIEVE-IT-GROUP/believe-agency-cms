export async function script(payloadConfig) {
  const module = await import('./bootstrap-tenant-content.ts')
  const runner = module.script || module.default?.script || module.default
  if (typeof runner !== 'function') {
    throw new Error(`Missing bootstrap-tenant-content runner. Exports: ${Object.keys(module).join(', ')}`)
  }
  await runner(payloadConfig)
}
