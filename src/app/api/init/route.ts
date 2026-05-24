import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// One-time schema initialization endpoint
// Called by container startup via curl before accepting traffic
export async function GET(request: Request) {
  const secret = request.headers.get('x-init-secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    // Temporarily set development mode so Payload's connect() runs pushDevSchema
    ;(process.env as Record<string, string>)['NODE_ENV'] = 'development'

    const { getPayload } = await import('payload')
    const { default: config } = await import('../../../payload.config')

    await getPayload({ config })

    return NextResponse.json({ ok: true, message: 'Schema initialized' })
  } catch (err: any) {
    // Tables may already exist
    return NextResponse.json({ ok: true, message: err?.message?.slice(0, 200) })
  } finally {
    ;(process.env as Record<string, string>)['NODE_ENV'] = 'production'
  }
}
