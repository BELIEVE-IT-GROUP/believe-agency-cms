export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Change NODE_ENV to development so Payload's connect() calls pushDevSchema
    // This creates all tables on first startup. Runs inside Next.js runtime
    // where @next/env is available (unlike external tsx scripts).
    ;(process.env as Record<string, string>)['NODE_ENV'] = 'development'

    try {
      const { getPayload } = await import('payload')
      const { default: config } = await import('./payload.config')
      await getPayload({ config })
      console.log('[instrumentation] Payload schema initialized successfully')
    } catch (err: any) {
      // Tables may already exist or connection is unavailable — log and continue
      const msg = err?.message ?? String(err)
      console.log('[instrumentation] Schema init result:', msg.slice(0, 120))
    } finally {
      ;(process.env as Record<string, string>)['NODE_ENV'] = 'production'
    }
  }
}
