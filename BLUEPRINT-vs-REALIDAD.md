# BLUEPRINT vs REALIDAD: Believe Agency CMS + Web Starter

**Fecha:** 2026-06-03
**Auditoría post-sesión:** tras conversación donde se intentó crear una "landing de prueba" en vez del sistema completo

---

## Resumen ejecutivo (sin filtros)

El CMS multi-tenant (backend) está **~75% completo** y funcional.  
El frontend starter (el componente que hace que el CMS sirva para algo) **NO EXISTE**.  
Se perdió una sesión completa construyendo HTML artesanal con Tailwind en vez de Flowbite Pro React.

**Veredicto:** El sistema NO está listo para generar webs ni landings. Falta el frontend. El CMS sin frontend es una caja negra con contenido que nadie puede ver.

---

## CMS: `believe-agency-cms` (believe-cms-multitenant)

### Lo que SÍ existe

| Blueprint Step | Estado | Evidencia |
|---|---|---|
| Step 1 — Repo + DB | COMPLETO | Repo en GitHub. Postgres en Coolify VPSDime operativo. |
| Step 2 — Payload base | COMPLETO | Payload 3.12.0 + Next.js 15. `generate:types` funciona. |
| Step 3 — Multi-tenant | COMPLETO | Plugin oficial. 6 colecciones con access control por tenant. Roles: super-admin / tenant-editor. |
| Step 4 — 15 bloques | COMPLETO | Todos los 15 bloques definidos en `src/blocks/`. Pages tiene campo `blocks` union. Drafts + autosave activos. |
| Step 5 — Media | COMPLETO | Media con upload, imageSizes, scope por tenant. Storage R2 (Cloudflare). |
| Step 7 — Deploy + DNS | COMPLETO | `cms.believe-global.com` con SSL. Deploy vía Coolify. |

### Lo que existe A MEDIAS

| Blueprint Step | Estado | Problema |
|---|---|---|
| Step 5 — GlobalSettings | **AUSENTE** | Falta colección GlobalSettings (logo, colores, nav, footer por tenant). El blueprint lo pide, no existe. |
| Step 6 — Email / invitaciones | **ROTO** | `nodemailerAdapter` configurado pero `verify: false` en colección Users. Esto bloquea invitaciones por email. George debe crear usuarios manualmente. |

### Lo que NO existe

| Blueprint Step | Estado | Impacto |
|---|---|---|
| Step 9 — Webhook revalidation | **AUSENTE** | No hay hooks `afterChange` en Pages/Posts. No hay endpoint `/api/revalidate`. ISR no se actualiza automáticamente. |
| Step 10 — Documentación operacional | **AUSENTE** | No hay guía de onboarding. George no puede incorporar un cliente solo. |

---

## Frontend Starter: `believe-web-starter`

### Estado: **NO EXISTE**

No hay directorio. No hay repo. No hay `package.json`. No hay componentes.  
Solo hay **dos archivos markdown** con blueprints:
- `BLUEPRINT-web-starter.md` (v1, Next.js 14)
- `BLUEPRINT-web-starter-v2.md` (v2, Next.js 15)

Ninguno de los dos se implementó.

### Lo que intentamos hacer en sesiones previas (y por qué fracasó)

En sesiones anteriores se intentó crear una "landing de prueba" rápida dentro del mismo repo del CMS. El resultado fue:

- HTML artesanal con clases Tailwind básicas
- NINGÚN componente de Flowbite React utilizado
- Iconos como strings de texto ("zap", "palette")
- Sin tipos, sin ISR real, sin conexión limpia al CMS
- Visualmente "HTML de 1995"
- Se perdio más tiempo en infraestructura (VPS caído, git locks, 401 de Vercel) que en UI/UX

**Esto NO es el starter.** El starter es un repo independiente, reutilizable, con Flowbite Pro React, ISR, webhooks, y conexión al CMS.

---

## Qué falta para estar "100% funcional listo para generar webs"

### P0 — Bloqueante (sin esto no sirve)

1. **Crear repo `believe-web-starter`** (Next.js 15 + Tailwind + TypeScript)
2. **Instalar Flowbite Pro React** (no el open source, el Pro con 50+ componentes)
3. **Implementar 15 componentes de bloque** usando Flowbite Pro:
   - `HeroBlock` → `HeroSection` de Flowbite
   - `FeaturesBlock` → `FeatureSection`
   - `PricingBlock` → `PricingSection`
   - `TestimonialsBlock` → `TestimonialSection`
   - `CtaBlock` → `CTASection`
   - `FaqBlock` → `FAQSection` + `Accordion`
   - `StatsBlock` → `StatsSection` / `CounterSection`
   - `TeamBlock` → `TeamSection`
   - `LogoCloudBlock` → `LogoCloud`
   - `GalleryBlock` → `GallerySection`
   - `ContactBlock` → `ContactSection`
   - `SplitContentBlock` → `ContentSection`
   - `VideoEmbedBlock` → `VideoSection`
   - `NewsletterBlock` → `NewsletterSection`
   - `BlogListBlock` → `BlogCards`
4. **BlockRenderer dinámico** que mapee `blockType` → componente
5. **Conexión al CMS** — `lib/payload.ts` con fetch tipado y filtro por tenant slug
6. **Rutas:** `/`, `/[slug]`, `/blog`, `/blog/[slug]`

### P1 — Importante (mejora el flujo operativo)

7. **Webhook revalidation** — hook `afterChange` en CMS + API route `/api/revalidate` en frontend
8. **Preview + Draft mode** — `/api/preview` para live preview desde el panel
9. **Arreglar email** — cambiar `verify: false` a `verify: true` en Users.ts
10. **GlobalSettings** en CMS (logo, colores, nav, footer por tenant)

### P2 — Pulido

11. SEO (generateMetadata, JSON-LD, OG images)
12. Documentación operacional (guía de onboarding)
13. Lighthouse > 90

---

## Tiempo estimado real

| Tarea | Estimación | Nota |
|---|---|---|
| Crear repo starter + scaffold | 2-3 horas | create-next-app, Tailwind, TypeScript |
| Instalar y configurar Flowbite Pro | 1-2 horas | Incluye token de registro privado |
| 15 componentes de bloque | 6-8 horas | ~30 min por bloque con Flowbite Pro |
| BlockRenderer + rutas + CMS client | 2-3 horas | |
| Webhook revalidation (ambos repos) | 2-3 horas | CMS hook + frontend API route |
| Preview + draft mode | 1-2 horas | |
| Fixes en CMS (email, GlobalSettings) | 2-3 horas | |
| QA + deploy + docs | 2-3 horas | |
| **TOTAL** | **~20-25 horas** | **~3 días de trabajo enfocado** |

---

## Lecciones de esta sesión

1. **No se respetó el blueprint.** Se intentó un atajo (landing de prueba) que no estaba en el plan.
2. **No se verificó el resultado visual.** Build pasó, pero el output era inaceptable.
3. **Scope creep masivo.** Se perdió tiempo en VPS, Docker, git locks, 401 de Vercel, en vez de construir el producto.
4. **Confusión de objetivos.** El objetivo era "dejar el sistema funcional", no "crear una landing de prueba".

---

## Próximo paso correcto

**Crear el repo `believe-web-starter` desde cero**, siguiendo el blueprint al pie de la letra.  
No atajos. No HTML artesanal. Flowbite Pro React real.  
Empezar por los bloques core (Hero, Features, CTA), conectar al CMS, y validar visualmente antes de seguir.

---

*Documento generado con brutal honestidad. Sin filtros.*
