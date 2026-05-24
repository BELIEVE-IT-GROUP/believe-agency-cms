import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Believe Agency CMS',
}

// Standalone Payload CMS: html/body are rendered by (payload)/layout.tsx
// via RootLayout from @payloadcms/next/layouts. This root layout must not
// wrap children in its own html/body or Payload's CSS selectors (html[data-theme])
// won't match and the admin renders as a blank page.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement
}
