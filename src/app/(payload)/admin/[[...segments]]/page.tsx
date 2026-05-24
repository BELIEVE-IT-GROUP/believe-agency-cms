import type { Metadata } from 'next'
import type { SanitizedConfig } from 'payload'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../../importMap'

// Payload v3 expects a Promise that resolves to the config module
const configPromise = import('@payload-config') as unknown as Promise<SanitizedConfig>

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config: configPromise, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config: configPromise, importMap, params, searchParams })

export default Page
