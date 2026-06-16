# BLUEPRINT-WEB-STARTER v2.0 — Multi-Agent Harness Production

**Proyecto:** `believe-web-starter` (repo BELIEVE-IT-GROUP/believe-web-starter)
**Fase:** BUILD (post-ARCHITECT)
**Fecha:** 2026-06-03
**Arquitecto:** @architect
**Orquestación:** Harness Multi-Agent con contratos y auditoría
**Meta:** Blueprint ejecutable 100% — no gaps entre CMS y frontend

---

## 1. Ejecutivo — Qué construimos y por qué

Un template Next.js 15 que renderiza páginas desde Payload CMS multi-tenant vía ISR. Cada cliente es un fork/clon con su tenant slug y despliegue propio en Vercel. El editor arrastra bloques en Payload; el reflejo aparece en el sitio sin redeploy.

**Complejidad:** Moderada. Payload ya está operativo. Se construye la capa de conexión (hooks + endpoints) y el frontend (renderer + 15 componentes).

---

## 2. Roster de Agentes (Harness)

Cada agente tiene un contrato: input obligatorio, output esperado, y auditoría de salida.

| Agente | Rol | Skill | Contrato de salida |
|---|---|---|---|
| **@cms_dev** | Extensión del CMS | Payload 3.x hooks, API routes, webhook ISR | `Contract.CMS_API` — endpoints listos + hooks probados |
| **@frontend_dev** | Starter Next.js | Next.js 15 App Router, Flowbite Pro, ISR, TypeScript | `Contract.FRONTEND` — 15 componentes + BlockRenderer + API client |
| **@integrator** | Conexión CMS ↔ Frontend | Fetch, tipos, revalidate, preview, draft mode | `Contract.INTEGRATION` — payload.ts tipado + ISR + preview funcionando |
| **@devops** | Deploy + Infra | Vercel, env vars, DNS, revalidación | `Contract.DEPLOY` — Vercel ready, envs inyectadas, DNS apuntado |
| **@qa_auditor** | Auditor de contratos | Testing, Lighthouse, verificaciones cruzadas | `Contract.AUDIT_OK` — 5 gates pasados, cada uno con evidencia |

---

## 3. Fases y dependencias de agentes

```
FASE A — CMS Extensions (@cms_dev solito, 1 día)
│
├── Hook afterChange en Pages + Posts → POST a webhook
├── Endpoint /api/contact → recibe form, envía email via Plunk
├── Endpoint /api/newsletter → suscribe a lista Plunk
├── Generar payload-types.ts
└── Verificar: `payload generate:types` sin errores
│
FASE B — Frontend Core (@frontend_dev solito, 2-3 días)
│
├── Scaffold Next.js + Tailwind + Flowbite Pro
├── BlockRenderer + 15 componentes
├── Header/Footer/Container (layout)
├── Media render con next/image + domains permitidos
└── Verify: dev build sin errores TS
│
FASE C — Integración (@integrator, 1 día)
│   Depende de: FASE A + FASE B
│
├── lib/payload.ts — cliente API tipado con tenant slug
├── ISR revalidation endpoint (api/revalidate)
├── Preview/Draft mode (api/preview + draft page)
├── Conectar blockType de Payload a componente React
├── Mapeo de lexical → HTML (richText renderer)
└── Verificar: end-to-end CMS → Frontend con datos reales
│
FASE D — Deploy (@devops, 0.5 días)
│   Depende de: FASE C
│
├── Crear repo en BELIEVE-IT-GROUP
├── Configurar env vars en Vercel
├── Deploy inicial
├── DNS apunta a Vercel
└── Verificar: https://cms.believe-global.com/admin + preview
│
FASE E — Auditoría (@qa_auditor, 0.5 días)
│   Depende de: FASE D
│
├── 5 Gates (ver sección 6)
├── Reporte de brechas → retroalimentación a FASE A/B/C/D
└── Aprobación GO/NO-GO para producción
```

---

## 4. Contratos de handoff entre agentes

### Contract.CMS_API (output de @cms_dev, input de @integrator)

**Obligatorios:**
- [ ] Listado de endpoints HTTP vivos en `cms.believe-global.com`:
  - `GET /api/pages?where[tenant][slug][equals]=<slug>` — devuelve páginas del tenant
  - `GET /api/posts?where[tenant][slug][equals]=<slug>` — devuelve posts del tenant
  - `GET /api/categories?where[tenant][slug][equals]=<slug>` — categorías
  - `GET /api/media` — archivos (filtrado por tenant)
  - `GET /api/tenants` — meta del tenant (logo, colors, domain)
  - **NUEVO** `POST /api/contact` — recibe `{ name, email, message, destinationEmail }`
  - **NUEVO** `POST /api/newsletter` — recibe `{ email, listId? }`
  - **NUEVO** `POST /api/revalidate` — hook interno (o se invoca desde frontend)
- [ ] Hook `afterChange` en Pages y Posts: dispara POST al webhook del cliente (`NEXT_PUBLIC_PREVIEW_URL`)
- [ ] `src/payload-types.ts` generado y versionado
- [ ] `.env.example` actualizado con vars nuevas (SMTP, CONTACT_DEST, PLUNK_API_KEY)
- [ ] Colección **Settings** (globals): tenant settings (nav links, social links, footer text, analytics ID)
- [ ] Auth: `PAYLOAD_REVALIDATE_TOKEN` para proteger endpoints sensibles

**Entregable:** `CONTRACT_CMS_API.md` con curl de cada endpoint + respuesta ejemplo JSON.

---

### Contract.FRONTEND (output de @frontend_dev, input de @integrator)

**Obligatorios:**
- [ ] Estructura de carpetas exacta (ver sección 8)
- [ ] `BlockRenderer.tsx` funciona con los 15 `blockType` del CMS
- [ ] `app/page.tsx` renderiza home (slug `/`) vía ISR
- [ ] `app/[slug]/page.tsx` renderiza cualquier página vía ISR
- [ ] `app/blog/page.tsx` → lista de posts
- [ ] `app/blog/[slug]/page.tsx` → post individual
- [ ] `app/api/revalidate/route.ts` recibe secret + slug
- [ ] `app/api/preview/route.ts` + `app/(preview)/[...slug]/page.tsx` con draftMode
- [ ] Componentes layout: Header (logo + nav desde tenant), Footer, Container
- [ ] `next/image` configurado con domains del CMS y R2
- [ ] SEO: `generateMetadata` en page.tsx y [slug]/page.tsx + `layout.tsx`
- [ ] RichText renderer: convierte lexical JSON a HTML limpio (no copia raw)
- [ ] Static assets (favicon, OG default image) en /public

**Entregable:** `CONTRACT_FRONTEND.md` + build sin errores (`next build`).

---

### Contract.INTEGRATION (output de @integrator, input de @devops)

**Obligatorios:**
- [ ] `lib/payload.ts` — cliente tipado que:
  - Lee `NEXT_PUBLIC_TENANT_SLUG`
  - Hace fetch a CMS con `depth=2`
  - Retry 3x con backoff exponencial
  - Cache fallback (si CMS cae, sirve último ISR) — no crash
  - Type-safe: consume `payload-types.ts`
- [ ] Revalidation funciona: publicar en CMS → página se actualiza en <5s
- [ ] Preview funciona: botón Preview en Payload abre borrador en frontend
- [ ] Contact form POST → llega email al destino (test con email real)
- [ ] Newsletter POST → suscribe en lista Plunk (test con email real)
- [ ] Lighthouse score > 90 (mobile + desktop)
- [ ] Sin errores de consola en navegador (no 404s de images, no CORS)
- [ ] Campos `tenant.primaryColor` + `tenant.accentColor` se inyectan como CSS variables

**Entregable:** `CONTRACT_INTEGRATION.md` + capturas de pantalla de preview/revalidate funcionando.

---

### Contract.DEPLOY (output de @devops, input de @qa_auditor)

**Obligatorios:**
- [ ] Repo creado en BELIEVE-IT-GROUP/believe-web-starter
- [ ] Build pasa en Vercel (build sin errores TS)
- [ ] Variables de entorno configuradas en Vercel Dashboard
- [ ] DNS: `clientex.com` apunta a Vercel (CNAME)
- [ ] SSL automático (Let's Encrypt via Vercel)
- [ ] Webhook ISR configurado en CMS apuntando a `https://clientex.com/api/revalidate`
- [ ] README operativo: "Cómo crear un cliente nuevo" (George puede seguirlo)

**Entregable:** `CONTRACT_DEPLOY.md` + URL funcional.

---

## 5. Auditoría — 5 Gates obligatorios (@qa_auditor)

Cada gate bloquea la siguiente fase. Si falla, retrocede al agente responsable.

### Gate 1 — CMS Extension Completo
**Responsable:** @cms_dev
**Prueba:**
```bash
curl -X POST https://cms.believe-global.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"TOKEN","slug":"home"}'
# Esperado: 200 + { revalidated: true }
```
- [ ] Hook afterChange existe en Pages y Posts
- [ ] `payload-types.ts` tiene tipos para los 15 bloques + Tenant + Settings
- [ ] Colección Settings (globals) existe con nav links, social links, footer
- [ ] Endpoints /api/contact y /api/newsletter funcionan
**Evidencia:** Screenshot de respuesta 200 + `git diff` de `$PAYLOAD_ROOT`

### Gate 2 — Frontend Renderiza Datos Reales
**Responsable:** @frontend_dev + @integrator
**Prueba:**
- [ ] `next dev` arranca sin errores
- [ ] `npm run build` completa sin errores TS
- [ ] Home (slug `/`) muestra bloques del CMS con datos reales (no placeholder)
- [ ] Imágenes cargan de R2 con `<Image>` (ver network tab, no 404)
- [ ] RichText del SplitContentBlock y FaqBlock se renderiza como HTML legible
**Evidencia:** Screenshot + URL del deploy preview

### Gate 3 — ISR + Preview End-to-End
**Responsable:** @integrator
**Prueba:**
1. Abrir panel admin CMS, editar headline del hero en home
2. Guardar → esperar 5s
3. Refrescar `clientex.com` → ver cambio reflejado
4. Guardar como draft → click Preview → ver borrador en frontend (no publicado)
**Evidencia:** Video del proceso + timestamp de publicación vs visualización

### Gate 4 — Lighthouse + Performance
**Responsable:** @frontend_dev
**Prueba:**
- [ ] Lighthouse mobile: Performance > 90, Accessibility > 95, Best Practices > 90, SEO > 95
- [ ] Lighthouse desktop: Performance > 90
- [ ] No Largest Contentful Paint > 2.5s
- [ ] No layout shifts en carga inicial
**Evidencia:** Screenshot de Lighthouse report

### Gate 5 — Onboarding en 1 hora
**Responsable:** @devops + @qa_auditor (simulando a George)
**Prueba:**
- [ ] Seguir README paso a paso para crear nuevo tenant + deploy
- [ ] Sin usar Claude Code ni terminal skill
- [ ] Resultado: repo creado + deployado + DNS apuntando en ≤1 hora
**Evidencia:** Timeline documentado de la prueba

---

## 6. Especificaciones técnicas detalladas (cubriendo gaps encontrados)

### 6.1 ADMIN CMS DE BELIEVE (ya existente, no tocar)
- URL: `https://cms.believe-global.com/admin`
- Repo: `BELIEVE-IT-GROUP/believe-agency-cms`
- Deploy: Coolify VPS

### 6.2 REPO NUEVO: `BELIEVE-IT-GROUP/believe-web-starter`
- Template público (para forks) o privado (para clones internos de George)
- Licencia: CONFIDENCIAL (no público — contiene access tokens y lógica interna)

### 6.3 FRONTEND STARTER — ARCHIVOS NUEVOS

#### `src/lib/payload.ts`
```typescript
import { GeneratedTypes } from '../payload-types'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL!
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG!
const REVALIDATE_TOKEN = process.env.PAYLOAD_REVALIDATE_SECRET! // DISTINTO de PAYLOAD_SECRET

// Helper genérico tipo-safe
export async function fetchPayload<T extends keyof GeneratedTypes['collections']>(
  collection: T,
  query?: { where?: Record<string, unknown>; depth?: number; limit?: number }
): Promise<{ docs: GeneratedTypes['collections'][T][] }> {
  const url = new URL(`${PAYLOAD_URL}/api/${String(collection)}`)
  url.searchParams.set('depth', String(query?.depth ?? 2))
  url.searchParams.set('where[tenant][slug][equals]', TENANT_SLUG)
  if (query?.limit) url.searchParams.set('limit', String(query.limit))
  
  const res = await fetch(url, {
    next: { tags: [`payload_${String(collection)}`] },
  })
  if (!res.ok) throw new Error(`Payload API error ${res.status}: ${await res.text()}`)
  return res.json()
}

// Caché de tenant para colores/logo
let tenantCache: GeneratedTypes['collections']['tenants'] | null = null
export async function getTenant() {
  if (tenantCache) return tenantCache
  const { docs } = await fetchPayload('tenants', { where: { slug: { equals: TENANT_SLUG } } as any, limit: 1 })
  tenantCache = docs[0]
  return tenantCache
}
```

#### `src/lib/tenant-style.tsx`
```typescript
// Inyecta CSS variables del tenant en el <head>
import { getTenant } from './payload'

export async function TenantStyleInjector() {
  const tenant = await getTenant()
  if (!tenant?.primaryColor && !tenant?.accentColor) return null
  return (
    <style>{`
      :root {
        ${tenant.primaryColor ? `--color-primary: ${tenant.primaryColor};` : ''}
        ${tenant.accentColor ? `--color-accent: ${tenant.accentColor};` : ''}
      }
    `}</style>
  )
}
```

#### `src/components/richtext/RichTextRenderer.tsx`
```typescript
'use client'
import { LexicalRichText } from '@payloadcms/richtext-lexical/react'
// O parser manual si no hay componente de lexical para React 19

export function RichTextRenderer({ data }: { data: any }) {
  if (!data) return null
  // Payload lexical guarda como { root: { children: [...] }}
  // Mapeamos a HTML simple
  return <div className="prose" dangerouslySetInnerHTML={{ __html: lexicalToHTML(data) }} />
}

function lexicalToHTML(node: any): string {
  if (!node) return ''
  if (node.type === 'text') {
    let text = escapeHtml(node.text)
    if (node.format & 1) text = `<b>${text}</b>` // bold
    if (node.format & 2) text = `<i>${text}</i>` // italic
    return text
  }
  if (node.children) {
    const inner = node.children.map(lexicalToHTML).join('')
    switch (node.type) {
      case 'paragraph': return `<p>${inner}</p>`
      case 'heading': return `<h${node.tag}>${inner}</h${node.tag}>`
      case 'link': return `<a href="${node.url}">${inner}</a>`
      default: return inner
    }
  }
  return ''
}
```

#### `src/app/api/revalidate/route.ts`
```typescript
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.secret !== process.env.PAYLOAD_REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  // Revalidar colección completa
  if (body.collection) {
    revalidateTag(`payload_${body.collection}`)
  }
  
  // Revalidar path específico
  if (body.slug === 'home' || body.slug === '/') {
    revalidatePath('/')
  } else if (body.slug) {
    revalidatePath(`/${body.slug}`)
  }
  
  return Response.json({ revalidated: true, timestamp: Date.now() })
}
```

#### `src/app/api/preview/route.ts`
```typescript
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const collection = searchParams.get('collection')
  
  if (secret !== process.env.PAYLOAD_REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  const draft = await draftMode()
  draft.enable()
  
  // Redirige a la ruta correspondiente con draft mode activado
  const targetPath = collection === 'posts' ? `/blog/${slug}` : `/${slug || ''}`
  redirect(targetPath)
}
```

#### `src/app/api/contact/route.ts`
```typescript
export async function POST(req: Request) {
  const { name, email, message, destinationEmail } = await req.json()
  
  // Envía via Plunk API (REST, no SMTP directo desde frontend)
  const plunkRes = await fetch('https://api.useplunk.com/v1/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PLUNK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: destinationEmail ?? process.env.DEFAULT_CONTACT_EMAIL,
      subject: `Contacto desde web: ${name}`,
      body: `De: ${name} <${email}>\n\n${message}`,
    }),
  })
  
  if (!plunkRes.ok) {
    return Response.json({ error: 'Failed to send email' }, { status: 500 })
  }
  return Response.json({ sent: true })
}
```

### 6.4 CSV DE BLOQUES (verificación cruzada CMS ↔ Frontend)

| blockType (Payload slug) | Componente React | Flowbite Pro equivalente | Estado actual CMS |
|---|---|---|---|
| `hero` | `HeroBlock.tsx` | `Hero` | Hero.ts (variantes: centered, split, video-bg, image-bg) |
| `features` | `FeaturesBlock.tsx` | `FeatureSection` | Features.ts (grid-3, grid-2, list, alternating) |
| `pricing` | `PricingBlock.tsx` | `PricingTable` | Pricing.ts (highlighted plan) |
| `testimonials` | `TestimonialsBlock.tsx` | `Testimonial` | Testimonials.ts (grid, carousel, masonry) |
| `cta` | `CtaBlock.tsx` | `CTABanner` | Cta.ts (banner, card, split) |
| `faq` | `FaqBlock.tsx` | `Accordion` | Faq.ts (richText answer) |
| `stats` | `StatsBlock.tsx` | `Stats` | Stats.ts (value, label, description) |
| `team` | `TeamBlock.tsx` | `Team` | Team.ts (members con social links) |
| `logo-cloud` | `LogoCloudBlock.tsx` | `BrandLogos` | LogoCloud.ts (marquee animate) |
| `gallery` | `GalleryBlock.tsx` | `Gallery` | Gallery.ts (masonry, grid, carousel) |
| `contact` | `ContactBlock.tsx` | `Form` | Contact.ts (dynamic fields) |
| `split-content` | `SplitContentBlock.tsx` | `ContentSection` + `imagePosition` | SplitContent.ts (richText body) |
| `video-embed` | `VideoEmbedBlock.tsx` | `Video` | VideoEmbed.ts (youtube, vimeo, direct) |
| `newsletter` | `NewsletterBlock.tsx` | `NewsletterForm` | Newsletter.ts (subscriber endpoint) |
| `blog-list` | `BlogListBlock.tsx` | `BlogCards` | BlogList.ts (count, layout, featured) |

---

## 7. Plan de recuperación y rollback

- **Rollback CMS:** El CMS no cambió (salvo hooks). Si algo falla, desactivar hooks reverte sin pérdida de datos.
- **Rollback Frontend:** Cada deploy es independiente en Vercel. Revert commit → instant rollback.
- **Rollback Integración:** Webhook se puede apuntar a URL vacía mientras se fixea.

---

## 8. Operational — Qué hace George

**Preparación (5 min):**
```bash
gh repo create BELIEVE-IT-GROUP/believe-web-starter --public
# Clonar believe-web-starter → push → Vercel auto-detecta Next.js
```

**Config Vercel (3 min):**
```
NEXT_PUBLIC_PAYLOAD_URL=https://cms.believe-global.com
NEXT_PUBLIC_TENANT_SLUG=clientex
PAYLOAD_REVALIDATE_SECRET=<nuevo-secreto-que-pones-en-CMS-tambien>
NEXT_PUBLIC_SITE_URL=https://clientex.com
PLUNK_API_KEY=<de infra>
```

**CMS (2 min):**
- Crear tenant "clientex" (ya hecho antes de clonar)
- Ir a Settings del tenant → pegar `NEXT_PUBLIC_PREVIEW_URL=https://clientex.com`
- Crear usuario editor → invitar

**DNS + Test (10 min):**
- Cloudflare: CNAME `clientex.com` → Vercel
- Probar contact form, newsletter, ISR, preview
- Listo. Cliente edita solo.

---

## 9. CRÍTICOS vs. ANTES DE PROD

| Item | Estado en CMS actual | Acción | Dueño |
|---|---|---|---|
| No existe `Settings` (globals) | ❌ | Agregar colección GlobalSettings con nav, social, footer | @cms_dev |
| No existe hook ISR | ❌ | Agregar hooks afterChange en Pages/Posts | @cms_dev |
| No existe `payload-types.ts` | ❌ | Ejecutar `payload generate:types` + commit | @cms_dev |
| No existe endpoint contact/newsletter | ❌ | Crear routes.ts en CMS o manejar en frontend | @frontend_dev |
| `NEXT_PUBLIC_PREVIEW_URL` placeholder | ⚠️ | Agregar a env + probar live preview | @cms_dev |
| No existe frontend | ❌ | Crear repo + implementar todo | @frontend_dev |
| Lighthouse > 90 | ❌ | Revisar en build final | @frontend_dev |
| README operativo | ❌ | Documentar onboarding | @devops |

---

*Sistema sobre proyecto. Dato sobre opinión. Calma sobre euforia.*
*Believe Tech · BAAS™*
