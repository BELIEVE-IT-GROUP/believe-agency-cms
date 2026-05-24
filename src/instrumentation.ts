export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Temporarily set development mode so Payload's connect() calls pushDevSchema
    // This creates all tables on first startup
    const prevEnv = process.env.NODE_ENV
    ;(process.env as Record<string, string>)['NODE_ENV'] = 'development'

    try {
      const { getPayload } = await import('payload')
      const { default: config } = await import('./payload.config')
      await getPayload({ config })
      console.log('[instrumentation] Payload schema initialized')
    } catch (err: any) {
      console.log('[instrumentation] Schema init:', err?.message?.slice(0, 80) ?? 'done')
    } finally {
      ;(process.env as Record<string, string>)['NODE_ENV'] = prevEnv ?? 'production'
    }
  }
}
