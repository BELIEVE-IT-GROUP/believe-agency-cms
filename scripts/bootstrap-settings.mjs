export async function script(payloadConfig) {
  const module = await import('./bootstrap-settings.ts')
  const runner = module.script || module.default?.script || module.default
  if (typeof runner !== 'function') {
    throw new Error(`Missing bootstrap-settings runner. Exports: ${Object.keys(module).join(', ')}`)
  }
  await runner(payloadConfig)
}
