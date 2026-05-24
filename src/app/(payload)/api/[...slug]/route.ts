import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

export const GET = REST_GET(import('@payload-config'))
export const POST = REST_POST(import('@payload-config'))
export const DELETE = REST_DELETE(import('@payload-config'))
export const PATCH = REST_PATCH(import('@payload-config'))
export const PUT = REST_PUT(import('@payload-config'))
export const OPTIONS = REST_OPTIONS(import('@payload-config'))
