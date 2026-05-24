import type { Metadata } from 'next'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../../importMap'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config: configPromise, params, searchParams })

export default async function Page({ params, searchParams }: Args) {
  // Initialize Payload singleton before RootPage accesses it
  await getPayload({ config: configPromise })
  return RootPage({ config: configPromise, importMap, params, searchParams })
}
