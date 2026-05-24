// Runs at container startup to push Payload schema via drizzle
// Uses NODE_ENV=development so pushDevSchema is called
const originalEnv = process.env.NODE_ENV
process.env.NODE_ENV = 'development'

async function run() {
  try {
    const { getPayload } = await import('payload')
    const configMod = await import('./src/payload.config')
    const config = configMod.default

    console.log('[init-db] Initializing Payload and pushing schema...')
    const payload = await getPayload({ config })
    await payload.db.connect({ config: payload.config })
    console.log('[init-db] Schema ready')
    await (payload.db as any)?.destroy?.()
  } catch (err: any) {
    // Tables may already exist — log but don't fail
    console.log('[init-db] Init result:', err?.message?.slice(0, 100) || 'OK')
  } finally {
    process.env.NODE_ENV = originalEnv || 'production'
    process.exit(0)
  }
}

run()
