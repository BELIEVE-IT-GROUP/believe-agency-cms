# BLUEPRINT: believe-web-starter — Frontend Starter

**Proyecto:** `believe-web-starter`
**Fase:** ARCHITECT
**Fecha:** 2026-06-03
**Architect:** @architect + George

---

## Visión

Template base para los sitios web de los clientes de Believe Agency. Consume la API headless del CMS multi-tenant (`cms.believe-global.com`) y renderiza páginas con ISR. Cada cliente = un fork/clon del starter con su propio deploy en Vercel.

## Stack

| Capa | Decisión |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | Flowbite Pro React (blocks + components) |
| CSS | Tailwind CSS 4 |
| Lenguaje | TypeScript 5 strict |
| Data fetching | fetch + ISR (revalidate) |
| Deploy | Vercel (por cliente) o Coolify |
| Host CMS | `cms.believe-global.com` |
| Análisis | OpenPanel o Vercel Analytics |

---

## Arquitectura

```
cliente.com (Vercel)
├── app/
│   ├── page.tsx                    → Home (fetch pages/?slug=/)
│   ├── [slug]/page.tsx             → Páginas dinámicas (ISR)
│   ├── blog/page.tsx               → Blog index (ISR)
│   ├── blog/[slug]/page.tsx        → Post individual (ISR)
│   ├── api/
│   │   ├── revalidate/route.ts     → Webhook de Payload
│   │   └── preview/route.ts        → Live preview
│   └── not-found.tsx
├── components/
│   ├── blocks/                     → 15 componentes de bloque
│   │   ├── BlockRenderer.tsx       → Router dinámico por slug
│   │   ├── HeroBlock/
│   │   ├── FeaturesBlock/
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx              → Nav global + logo del tenant
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   └── ui/                         → Componentes Flowbite Pro customizados
├── lib/
│   ├── payload.ts                  → Cliente API tipado
│   ├── tenant.ts                   → Config de tenant desde env
│   └── utils.ts                    → cn(), formatDate(), etc.
└── types/
    └── payload-types.ts            → Tipos generados (sync con CMS)
```

---

## Conexión con el CMS

### Payload API Client (`lib/payload.ts`)

```typescript
const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL!
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG!

async function fetchAPI<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${PAYLOAD_URL}/api/${path}`)
  url.searchParams.set('depth', '2')
  url.searchParams.set('where[tenant][slug][equals]', TENANT_SLUG)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url, { next: { revalidate: 60 } })
  return res.json()
}
```

### Variables de entorno

```bash
# Obligatorias
NEXT_PUBLIC_PAYLOAD_URL=https://cms.believe-global.com
NEXT_PUBLIC_TENANT_SLUG=clientex
PAYLOAD_REVALIDATE_TOKEN=secret-compartido-con-cms

# Opcionales
NEXT_PUBLIC_SITE_URL=https://clientex.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Uso de Flowbite Pro (50+ componentes)

Flowbite Pro tiene 50+ componentes React. Se usan en 3 categorías distintas:

| Categoría | Propósito | Componentes Flowbite Pro |
|---|---|---|
| **Layout** | Shell del sitio, navegación, footer | `Navbar`, `Footer`, `Sidebar`, `Breadcrumb`, `Container` |
| **UI primitives** | Elementos de interfaz reutilizables | `Button`, `Card`, `Badge`, `Tabs`, `Accordion`, `Modal`, `Form`, `Input`, `Textarea`, `Select`, `Checkbox`, `Rating`, `Avatar`, `Dropdown`, `Tooltip`, `Spinner`, `Toast`, `Alert`, `Pagination`, `Table`, `List`, `Timeline`, `Progress`, `MegaMenu`, `SpeedDial` |
| **Page sections** | Los 15 bloques del CMS + secciones adicionales | `HeroSection`, `FeatureSection`, `PricingSection`, `TestimonialSection`, `CTASection`, `FAQSection`, `StatsSection` / `CounterSection`, `TeamSection`, `LogoCloud`, `GallerySection`, `ContactSection`, `ContentSection`, `VideoSection`, `NewsletterSection`, `BlogCards` |

Los 15 bloques del CMS son el **catálogo de contenido editable** — el editor los arma en el panel. Los componentes de layout y UI primitives se usan directamente en el código del starter (Header, Footer, botones, cards, etc.). No hace falta crear un bloque de Payload para cada componente de Flowbite Pro; los que no son editables van hardcodeados en el template.

### Expansión futura del catálogo

Cuando un cliente necesite una sección nueva (ej: `timeline`, `comparison-table`, `mega-menu`), se agrega como bloque nuevo en ambos lados:

1. Schema en `believe-agency-cms/src/blocks/` (5-30 min)
2. Componente en `believe-web-starter/components/blocks/` (15-60 min con Flowbite Pro)
3. Registro en el BlockRenderer + el importMap del CMS

El starter está diseñado para que agregar un bloque sea solo agregar un archivo en `components/blocks/` y una entrada en el map.

## Block Renderer

El core del starter. Mapea el `blockType` de Payload al componente React correspondiente.

### `components/blocks/BlockRenderer.tsx`

```typescript
import { HeroBlock } from './HeroBlock'
import { FeaturesBlock } from './FeaturesBlock'
// ... 15 imports

const blockComponents = {
  hero: HeroBlock,
  features: FeaturesBlock,
  pricing: PricingBlock,
  testimonials: TestimonialsBlock,
  cta: CtaBlock,
  faq: FaqBlock,
  stats: StatsBlock,
  team: TeamBlock,
  'logo-cloud': LogoCloudBlock,
  gallery: GalleryBlock,
  contact: ContactBlock,
  'split-content': SplitContentBlock,
  'video-embed': VideoEmbedBlock,
  newsletter: NewsletterBlock,
  'blog-list': BlogListBlock,
} as const

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return blocks?.map((block, i) => {
    const Component = blockComponents[block.blockType as keyof typeof blockComponents]
    if (!Component) return null
    return <Component key={`${block.id}-${i}`} {...block} />
  })
}
```

Renderizado en page.tsx:
```typescript
<BlockRenderer blocks={page.blocks} />
```

---

## Especificación de los 15 bloques

Cada bloque es un componente React que recibe los fields de Payload como props con el mismo nombre de campo.

### HeroBlock

| Prop | Tipo | Descripción |
|---|---|---|
| variant | `'centered' \| 'split' \| 'video' \| 'image-bg'` | Variante visual |
| headline | `string` | Titular principal |
| subheadline | `string?` | Subtítulo |
| ctas | `{ text, url, style }[]` | Botones (max 3) |
| image | `Media?` | Imagen (upload relation) |
| videoUrl | `string?` | URL para variante video |
| badge | `string?` | Badge superior |

**Flowbite Pro:** `HeroSection` con variantes. Mapear `type` de Flowbite según variant:
- centered → `HeroSection type="center"`
- split → `HeroSection type="imageLeft"` o `type="imageRight"`
- video → `HeroSection type="video"` con iframe
- image-bg → `HeroSection type="background"` con `style={{ backgroundImage }}`

### FeaturesBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| subheadline | `string?` | Subtítulo |
| layout | `'grid-3' \| 'grid-2' \| 'list' \| 'alternating'` | Layout |
| items | `{ icon, title, description, image? }[]` | Features |

**Flowbite Pro:** `FeatureSection`. Mapear: grid-3 → `columns={3}`, grid-2 → `columns={2}`, list → `FeatureList`, alternating → `AlternatingFeatures`.

### PricingBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| subheadline | `string?` | Subtítulo |
| plans | `Plan[]` | Array de planes |

**Flowbite Pro:** `PricingSection`. El plan con `highlighted: true` recibe `theme="recommended"`.

### TestimonialsBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| layout | `'grid' \| 'carousel' \| 'masonry'` | Layout |
| items | `Testimonial[]` | Testimonios con rating |

**Flowbite Pro:** `TestimonialSection`. Carousel layout → `TestimonialCarousel`.

### CtaBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string` | Titular |
| subheadline | `string?` | Subtítulo |
| variant | `'banner' \| 'card' \| 'split'` | Layout |
| ctas | `{ text, url, style }[]` | Botones (max 2) |
| backgroundImage | `Media?` | Imagen de fondo |

**Flowbite Pro:** `CTASection`. Banner → full-width con bg image o color.

### FaqBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| subheadline | `string?` | Subtítulo |
| items | `{ question, answer }[]` | FAQ items |

**Flowbite Pro:** `FAQSection` con `Accordion`. Answer es richText → renderizar con lexical → HTML.

### StatsBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| items | `{ value, label, description? }[]` | 2-6 métricas |

**Flowbite Pro:** `StatsSection` o `CounterSection`. Animar conteo al entrar en viewport con IntersectionObserver + Flowbite counter.

### TeamBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| subheadline | `string?` | Subtítulo |
| members | `Member[]` | Miembros con redes |

**Flowbite Pro:** `TeamSection`.

### LogoCloudBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| logos | `{ image, alt, url? }[]` | Logos de clientes |
| animate | `boolean` | Marquee infinito |

**Flowbite Pro:** `LogoCloud`. Si animate=true → wrapper con animación CSS marquee (scroll infinito).

### GalleryBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| layout | `'masonry' \| 'grid' \| 'carousel'` | Layout visual |
| images | `{ image, caption? }[]` | Imágenes |

**Flowbite Pro:** `GallerySection`. Carousel → `Carousel`. Masonry → CSS columns. Grid → Tailwind grid.

### ContactBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| subheadline | `string?` | Subtítulo |
| destinationEmail | `string` | Email destino |
| successMessage | `string` | Mensaje post-envío |
| fields | `FormField[]` | Campos dinámicos |

**Flowbite Pro:** `ContactSection` con formulario. POST a API route `/api/contact` que envía email. Server action para el submit.

### SplitContentBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string` | Título |
| body | `RichText` | Contenido richText |
| image | `Media?` | Imagen |
| imagePosition | `'left' \| 'right'` | Lado de imagen |
| cta | `{ text, url }?` | CTA opcional |

**Flowbite Pro:** `ContentSection` con `imagePosition`. body se renderiza con lexical → HTML. Static import para imagen optimizada con `next/image`.

### VideoEmbedBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| subheadline | `string?` | Subtítulo |
| source | `'youtube' \| 'vimeo' \| 'direct'` | Fuente |
| videoId | `string?` | ID o URL |
| poster | `Media?` | Thumbnail |
| autoplay | `boolean` | Autoplay muted |
| fullWidth | `boolean` | Ancho completo |

**Flowbite Pro:** `VideoSection`. YouTube → iframe con `youtube-nocookie`. Vimeo → iframe. Direct → `<video>` tag.

### NewsletterBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string` | Título |
| subheadline | `string?` | Subtítulo |
| placeholder | `string` | Placeholder input |
| ctaText | `string` | Botón |
| successMessage | `string` | Mensaje éxito |
| destinationEmail | `string?` | Email backup |

**Flowbite Pro:** `NewsletterSection`. POST a API route que envía a Plunk (ya disponible en el VPS de Believe).

### BlogListBlock

| Prop | Tipo | Descripción |
|---|---|---|
| headline | `string?` | Título |
| count | `number` | 1-12 posts |
| layout | `'grid' \| 'list' \| 'featured'` | Layout |
| cta | `{ text, url }?` | Link "Ver todos" |

**Flowbite Pro:** `BlogCards`. Featured layout → primer post como hero card + grid con los demás. Los posts se obtienen via `fetchAPI('posts')` con SSR/ISR.

---

## ISR + Webhook Revalidation

### `app/api/revalidate/route.ts`

Payload envía un POST a `https://clientex.com/api/revalidate` con `{ secret, collection, slug }`.

```typescript
export async function POST(req: Request) {
  const body = await req.json()
  if (body.secret !== process.env.PAYLOAD_REVALIDATE_TOKEN) {
    return Response.json({ error: 'Invalid token' }, { status: 401 })
  }
  revalidatePath('/')
  if (body.slug) revalidatePath(`/${body.slug}`)
  return Response.json({ revalidated: true })
}
```

### `app/api/preview/route.ts`

Live preview desde el panel admin. Payload abre `https://clientex.com/api/preview?collection=pages&slug=home`.

```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const collection = searchParams.get('collection')
  const slug = searchParams.get('slug')
  redirect(`/api/draft?secret=${process.env.PAYLOAD_REVALIDATE_TOKEN}&slug=${slug}`)
}
```

Usar `draftMode()` de Next.js para servir borradores en preview.

---

## SEO

Cada página renderiza:
- Meta title → `{seo.title || page.title}`
- Meta description → `{seo.description}`
- OG image → `{seo.image?.url}`
- Schema.org JSON-LD según tipo de página (WebPage, Article, etc.)
- Open Graph tags

Posts individuales:
- Article schema
- BlogPosting structured data
- Author, publishedDate, coverImage

---

## Componentes globales

### Header (`components/layout/Header.tsx`)

- Logo del tenant desde `Tenant.logo`
- Navegación principal (extraída de GlobalSettings o hardcodeada en starter)
- Mobile menu hamburguesa
- Flowbite Pro `Navbar`

### Footer (`components/layout/Footer.tsx`)

- Logo, redes sociales, links
- Flowbite Pro `Footer`

### Container (`components/layout/Container.tsx`)

- Wrapper Tailwind con max-width responsivo
- Padding consistente

---

## Flujo completo: incorporar un cliente nuevo

```
Llega cliente nuevo
│
├── 1. GEORGE (5 min)
│   └── CMS: crea tenant "Cliente X" con slug, dominio, colores, logo
│
├── 2. GEORGE (3 min)
│   └── CMS: crea usuario editor@clientex.com → se envía invitación por email
│
├── 3. GEORGE (30 min, una sola vez)
│   ├── Clona believe-web-starter → repo privado del cliente
│   ├── Configura variables de entorno en Vercel:
│   │   NEXT_PUBLIC_TENANT_SLUG=clientex
│   │   PAYLOAD_REVALIDATE_TOKEN=…
│   │   NEXT_PUBLIC_PAYLOAD_URL=https://cms.believe-global.com
│   └── Deploy a Vercel (git push → deploy automático)
│
├── 4. GEORGE (10 min)
│   ├── CMS → configura webhook en Pages/Posts:
│   │   URL: https://clientex.com/api/revalidate
│   │   Secret: el mismo PAYLOAD_REVALIDATE_TOKEN
│   └── Prueba: publicar página de prueba → frontend la muestra
│
├── 5. GEORGE (15 min)
│   ├── DNS: apunta clientex.com → Vercel (CNAME)
│   ├── CMS: asigna dominio al tenant
│   └── Prueba: https://clientex.com carga el sitio
│
├── 6. EDITOR (días, contenido)
│   ├── Login en cms.believe-global.com/admin
│   ├── Crea páginas (home, servicios, nosotros, contacto…) con bloques
│   ├── Crea posts de blog si aplica
│   └── Publica → ISR actualiza el frontend en segundos
│
└── 7. GEORGE (mantenimiento)
    ├── Agrega bloques nuevos al catálogo si el cliente los necesita
    ├── Personaliza CSS/componentes en el repo del cliente
    └── Repite: el starter se actualiza → cada cliente mergea lo que necesita
```

**Tiempo total de George para dejar un cliente corriendo:** ~1 hora (pasos 1-5).
**El cliente edita contenido solo** sin intervención de George.

### Variante: cliente sin diseñador / sin contenido propio

Si el cliente no tiene equipo editorial (ej: una PyME que solo quiere landing):

1. George crea tenant + usuario
2. George clona starter, deploya
3. Believe les ofrece: "nosotros les armamos las páginas" → George llena el contenido desde el panel
4. Cliente solo paga hosting + mantenimiento

### Variante: cliente existente con su propio frontend

Si el cliente ya tiene un sitio y solo quiere el CMS headless:

1. George crea tenant + usuario
2. NO se clona el starter
3. El frontend existente consume la API de Payload con el tenant slug
4. Payload solo sirve como headless CMS — el cliente mantiene su frontend

---

## Build Order

### Step 1 — Scaffold + Tailwind + Flowbite Pro [setup]
**Desc:** `create-next-app` con App Router, TypeScript, Tailwind. Instalar Flowbite Pro desde npm registry privado. Configurar `tailwind.config` con plugin de Flowbite.
**Verify:** `next dev` muestra H1 de prueba con colores de Flowbite.

### Step 2 — Payload API client + tipos [foundational]
**Desc:** `lib/payload.ts` con fetch API tipada. Sincronizar `payload-types.ts` desde el CMS. Variable `NEXT_PUBLIC_TENANT_SLUG`.
**Verify:** Test route que muestra datos de API en `/api/test`.

### Step 3 — BlockRenderer + HeroBlock [foundational]
**Desc:** `components/blocks/BlockRenderer.tsx` + `HeroBlock` con Flowbite Pro `HeroSection`. Página home con fetch de page slug="/".
**Verify:** Home renderiza hero con datos reales del CMS.

### Step 4 — FeaturesBlock + StatsBlock + LogoCloudBlock [foundational]
**Desc:** Tres bloques "simples" (sin richText ni fetching adicional). Flowbite Pro `FeatureSection`, `StatsSection`, `LogoCloud`.
**Verify:** Página con 3 bloques renderiza todo correctamente.

### Step 5 — CtaBlock + TestimonialsBlock + TeamBlock [foundational]
**Desc:** Bloques con arrays de items. Flowbite Pro `CTASection`, `TestimonialSection`, `TeamSection`.
**Verify:** Llenar testimonios y equipo en CMS → se ven en frontend.

### Step 6 — FaqBlock + SplitContentBlock [foundational]
**Desc:** Bloques con richText. Implementar lexical → HTML parser (`@payloadcms/richtext-lexical/...`). Flowbite Pro `FAQSection` + `ContentSection`.
**Verify:** FAQ con richText se renderiza, SplitContent con richtext + imagen.

### Step 7 — PricingBlock + GalleryBlock + VideoEmbedBlock [foundational]
**Desc:** Pricing con plan destacado. Gallery con 3 layouts. Video con YouTube/Vimeo/direct.
**Verify:** Pricing muestra "Más popular" destacado. Gallery cambia layout. Video reproduce.

### Step 8 — ContactBlock + NewsletterBlock [foundational]
**Desc:** Formularios con server actions. Contact → envía email. Newsletter → POST a Plunk API.
**Verify:** Llenar formulario → llega email. Newsletter → suscriptor en Plunk.

### Step 9 — BlogListBlock + Blog single [foundational]
**Desc:** BlogListBlock en páginas. Ruta `/blog/[slug]` para post individual. Posts desde API con ISR. Flowbite Pro `BlogCards`.
**Verify:** Post en CMS → visible en blog. Click → página individual.

### Step 10 — ISR + Revalidation [story]
**Desc:** API route `/api/revalidate`. Payload webhook apunta a cliente.com/api/revalidate. `revalidatePath` en colecciones pages/posts. Draft mode para preview.
**Verify:** Publicar página en CMS → frontend se actualiza en <5s sin redeploy.

### Step 11 — Preview + Draft mode [story]
**Desc:** `app/api/preview/route.ts` con `draftMode()`. Draft page que muestra borradores. Payload live preview apunta a cliente.com/api/preview.
**Verify:** Editar página en CMS → botón Preview → borrador en frontend.

### Step 12 — SEO + Performance [story]
**Desc:** Metadatos por página (generateMetadata). JSON-LD schema. OG images. Lighthouse audit > 90. Source maps off en prod.
**Verify:** Lighthouse > 90. URL preview en LinkedIn muestra OG card.

### Step 13 — README + Documentación [story]
**Desc:** README con setup, variables de entorno, cómo conectar tenant. Guía rápida "Cómo agregar un bloque nuevo".
**Verify:** George puede clonar y configurar un nuevo cliente siguiendo la guía.

---

## Variables de entorno (frontend cliente)

```bash
# Obligatorias
NEXT_PUBLIC_PAYLOAD_URL=https://cms.believe-global.com
NEXT_PUBLIC_TENANT_SLUG=
PAYLOAD_REVALIDATE_TOKEN=

# Opcionales
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_PLUNK_API_KEY=
```

## Lo que NO entra aquí

- Lógica de negocio específica del cliente (login, dashboard, CRM)
- Distintas fuentes de datos que no sean Payload
- Server-rendered pages sin ISR (cada cliente decide su revalidate time)
- El CMS mismo (ya existe en `believe-agency-cms`)

---

*Sistema sobre proyecto. Dato sobre opinión. Calma sobre euforia.*
*Believe Tech · BAAS™*
