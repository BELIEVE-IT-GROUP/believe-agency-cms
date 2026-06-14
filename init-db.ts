// Startup script: push Payload schema (creates all tables) then exit
// tsx runs this before next start so the DB is ready for first request
import { getPayload } from 'payload'
import config from './src/payload.config.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(process.env as any)['NODE_ENV'] = 'development'

async function run() {
  try {
    console.log('[init-db] Pushing schema...')
    const payload = await getPayload({ config })
    console.log('[init-db] Done')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (payload.db as any)?.destroy?.()
  } catch (err: any) {
    console.log('[init-db]', err?.message?.slice(0, 120) ?? 'error')
  }
  process.exit(0)
}

run()
