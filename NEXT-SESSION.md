# Prompt para sesión nueva — Believe Agency CMS Step 8

## Contexto rápido
Tengo un Payload CMS v3 multi-tenant corriendo en https://cms.believe-global.com/admin.
El CMS tiene 15 bloques definidos, multi-tenant activo, drafts/versions, live preview configurado.
Repo: BELIEVE-IT-GROUP/believe-agency-cms

## Tarea de esta sesión: Step 8 — believe-web-starter

Crear el repo `BELIEVE-IT-GROUP/believe-web-starter` como template Next.js para webs de clientes.

**Stack:**
- Next.js 15 (App Router, TypeScript strict)
- Tailwind CSS v4
- Flowbite Blocks Pro (ya tenemos licencia — preguntar a George dónde está el paquete npm)
- pnpm

**Lo que debe tener:**

1. `lib/payload.ts` — cliente Payload API tipado:
```ts
// Fetch pages por tenant + slug
// Fetch posts por tenant
// Tipos generados desde cms.believe-global.com/api/payload-types
```

2. `components/BlockRenderer.tsx` — renderizador dinámico:
```tsx
// Recibe page.blocks (array de bloques de Payload)
// Switch por blockType → renderiza el componente Flowbite correspondiente
```

3. Un componente por bloque (15 total) en `components/blocks/`:
- HeroBlock → Flowbite Hero section
- FeaturesBlock → Flowbite Feature section
- PricingBlock → Flowbite Pricing table
- TestimonialsBlock → Flowbite Testimonial
- CtaBlock → Flowbite CTA
- FaqBlock → Flowbite FAQ accordion
- BlogListBlock → Flowbite Blog grid
- StatsBlock → Flowbite Stats
- TeamBlock → Flowbite Team section
- LogoCloudBlock → Flowbite Logo cloud
- GalleryBlock → Flowbite Gallery
- ContactBlock → Flowbite Contact form
- SplitContentBlock → Flowbite Content section
- VideoEmbedBlock → iframe con poster
- NewsletterBlock → Flowbite Newsletter

4. `app/[slug]/page.tsx` — página dinámica con ISR:
```tsx
// fetch page por slug desde Payload API
// revalidate: false (ISR on-demand via webhook)
```

5. `app/api/preview/route.ts` — preview mode para live preview de Payload

6. `app/api/revalidate/route.ts` — webhook endpoint que Payload llama al publicar

7. `.env.example`:
```
NEXT_PUBLIC_PAYLOAD_URL=https://cms.believe-global.com
NEXT_PUBLIC_TENANT_SLUG=mi-cliente
PAYLOAD_REVALIDATE_SECRET=xxx
```

**Preguntas a George antes de empezar:**
- ¿Dónde está el paquete npm de Flowbite Blocks Pro? ¿Token NPM o zip?
- ¿Ya hay algún diseño/mockup o arrancamos con los defaults de Flowbite?
- ¿El primer cliente que vamos a crear para probar quién es?

**Archivos de referencia:**
- /Users/mac/Desktop/believe-cms-multitenant/BLUEPRINT.md
- /Users/mac/Desktop/believe-cms-multitenant/src/blocks/ — schemas de bloques en Payload
- /Users/mac/Desktop/believe-cms-multitenant/CONTEXT.md
