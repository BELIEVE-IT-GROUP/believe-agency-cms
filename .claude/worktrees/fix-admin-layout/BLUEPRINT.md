# BLUEPRINT: Believe Agency CMS — Multi-Tenant Payload

**Proyecto:** `believe-agency-cms`
**Fase actual:** ARCHITECT
**Fecha:** 2026-05-23
**Architect:** @architect + George

---

## Visión

Una instancia Payload CMS centralizada en el VPS de Believe, con multi-tenancy nativo.
Cada cliente de agencia = un tenant aislado: sus contenidos, sus usuarios, su panel.
Cada web cliente (Next.js) en Vercel consume la API headless filtrada por tenant.
Believe-web tiene su propio Payload separado — **no entra aquí**.

---

## Decisiones de arquitectura

| Decisión | Valor |
|---|---|
| CMS | Payload 3.x (Next.js native, MIT) |
| Multi-tenancy | `@payloadcms/plugin-multi-tenant` oficial |
| DB | Postgres nueva en Coolify (VPS 104.237.2.124) |
| Panel admin | `cms.believe-global.com` |
| Auth editores | Invitación manual desde panel → email |
| Email | SMTP via Plunk (ya en VPS) |
| Frontend webs | Next.js (ISR) — starter template clonado por cliente |
| Deploy webs | Vercel (por cliente) o Coolify según caso |
| UI bloques | Flowbite Pro React |
| DNS | Cloudflare |

---

## Catálogo de bloques (compartido entre todos los tenants)

Cada bloque = schema TypeScript en Payload + componente React con Flowbite Pro.

| Bloque | Campos clave |
|---|---|
| `hero` | titulo, subtitulo, cta_texto, cta_url, imagen, variante (centered/split/video) |
| `features` | titulo, items[{icono, titulo, descripcion}], layout (grid/list) |
| `pricing` | titulo, planes[{nombre, precio, features[], cta}], destacado |
| `testimonials` | titulo, items[{nombre, cargo, empresa, foto, texto, rating}] |
| `cta` | titulo, subtitulo, cta_texto, cta_url, variante (banner/card/split) |
| `faq` | titulo, items[{pregunta, respuesta}] |
| `blog-list` | titulo, cantidad, categoria_filtro |
| `stats` | items[{numero, label, descripcion}] |
| `team` | titulo, miembros[{nombre, cargo, foto, bio, redes}] |
| `logo-cloud` | titulo, logos[{imagen, alt, url}] |
| `gallery` | titulo, imagenes[], columnas |
| `contact` | titulo, campos[], email_destino |
| `split-content` | titulo, cuerpo (richtext), imagen, imagen_lado (left/right) |
| `video-embed` | titulo, url_video, poster, autoplay |
| `newsletter` | titulo, subtitulo, placeholder, cta_texto |

---

## Arquitectura de colecciones Payload

```
Tenants          → slug, nombre, dominio, logo, colores
Users            → email, nombre, rol, tenant (FK)
Pages            → titulo, slug, tenant (FK), bloques[] (union de todos los bloques)
Posts            → titulo, slug, tenant (FK), contenido (richtext), categoria, imagen
Media            → archivo, alt, tenant (FK)
Categories       → nombre, slug, tenant (FK)
GlobalSettings   → logo, colores, nav, footer — uno por tenant (globals plugin)
```

---

## Build Order

### Step 1 — Repo + DB [setup]
**Descripción:** Crear repositorio GitHub en BELIEVE-IT-GROUP, inicializar Postgres en Coolify.
**Dependencias:** Ninguna
**Phase:** setup
**Criterio de éxito:** `psql $DATABASE_URL -c "\l"` muestra la DB. Repo en GitHub con `main` protegido.

### Step 2 — Payload base install [foundational]
**Descripción:** `create-payload-app` con adaptador Postgres, TypeScript strict, estructura de carpetas base.
**Dependencias:** Step 1
**Phase:** foundational
**Criterio de éxito:** `payload generate:types` sin errores. `pnpm dev` levanta el panel en localhost.

### Step 3 — Plugin multi-tenant + colecciones core [foundational]
**Descripción:** Instalar `@payloadcms/plugin-multi-tenant`. Definir colecciones `Tenants`, `Users` con campo tenant, access control por tenant.
**Dependencias:** Step 2
**Phase:** foundational
**Criterio de éxito:** Crear dos tenants en el panel → usuario A solo ve datos del tenant A, usuario B solo del B.

### Step 4 — Catálogo de bloques completo [foundational]
**Descripción:** Definir los 15 bloques en TypeScript dentro de Payload. Colección `Pages` con campo `bloques` tipo `blocks` (union de todos). Colección `Posts` con richtext.
**Dependencias:** Step 3
**Phase:** foundational
**Criterio de éxito:** Crear una página en el panel, agregar bloque `hero` + `features` + `cta`, guardar sin errores de validación.

### Step 5 — Media + GlobalSettings [foundational]
**Descripción:** Colección `Media` con scope por tenant. Plugin `globals` para `GlobalSettings` (logo, colores, nav, footer) — un documento por tenant.
**Dependencias:** Step 3
**Phase:** foundational
**Criterio de éxito:** Subir imagen desde tenant A → tenant B no la ve en su selector.

### Step 6 — Email / invitaciones [foundational]
**Descripción:** Configurar SMTP via Plunk para que Payload envíe invitaciones de usuario. Personalizar template de email con branding de Believe.
**Dependencias:** Step 3
**Phase:** foundational
**Criterio de éxito:** Invitar usuario desde panel → llega email con link de activación que funciona.

### Step 7 — Deploy Coolify + DNS [foundational]
**Descripción:** Dockerfile/servicio en Coolify apuntando al repo. Variables de entorno desde Coolify. DNS Cloudflare → `cms.believe-global.com`. SSL Let's Encrypt automático.
**Dependencias:** Step 2, Step 6
**Phase:** foundational
**Criterio de éxito:** `https://cms.believe-global.com` carga el panel con SSL válido. Variables de entorno no visibles en repo.

### Step 8 — Next.js starter template [story]
**Descripción:** Repo template `believe-web-starter` con Next.js + Flowbite Pro + Tailwind. Renderer dinámico de bloques (`<BlockRenderer blocks={page.bloques} />`). ISR configurado (revalidate por webhook de Payload). Componentes para los 15 bloques usando Flowbite Pro.
**Dependencias:** Step 4
**Phase:** story
**Criterio de éxito:** Clonar starter → conectar a tenant de Payload → página renderiza todos los bloques con datos reales. Lighthouse score > 90.

### Step 9 — Webhook revalidation [story]
**Descripción:** Hook en Payload que dispara webhook a Vercel/Coolify cuando una página se publica. El frontend revalida ISR automáticamente.
**Dependencias:** Step 7, Step 8
**Phase:** story
**Criterio de éxito:** Editar texto en panel → guardar → en menos de 5s el frontend actualiza sin redeploy manual.

### Step 10 — Documentación operacional [story]
**Descripción:** Guía "Cómo agregar un nuevo cliente": crear tenant → crear usuarios → clonar starter → conectar → deploy. Guía "Cómo agregar un bloque nuevo al catálogo".
**Dependencias:** Step 8, Step 9
**Phase:** story
**Criterio de éxito:** George puede onboardear un cliente nuevo siguiendo la guía sin ayuda de Claude.

---

## Diagrama de flujo

```
George (panel cms.believe-global.com)
  └── Crea tenant "Cliente X"
  └── Crea usuario "editor@clientex.com" → recibe invitación
  └── Editor llena contenido (bloques, páginas, posts)

Payload API (cms.believe-global.com/api)
  └── GET /api/pages?where[tenant][slug][equals]=clientex
  └── Filtra por tenant automáticamente

Web cliente (clientex.com en Vercel)
  └── fetch() a Payload API en build/revalidate
  └── <BlockRenderer> renderiza cada bloque con Flowbite Pro
  └── ISR: revalida solo cuando Payload dispara webhook
```

---

## Variables de entorno requeridas

```bash
# Payload
DATABASE_URI=postgresql://...
PAYLOAD_SECRET=...
NEXT_PUBLIC_SERVER_URL=https://cms.believe-global.com

# Email
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# Frontend (por web cliente)
NEXT_PUBLIC_PAYLOAD_URL=https://cms.believe-global.com
NEXT_PUBLIC_TENANT_SLUG=clientex
PAYLOAD_REVALIDATE_SECRET=...
```

---

## Lo que NO entra aquí

- Believe-web (tiene su propio Payload embebido)
- E-commerce real (si un cliente lo necesita → instancia separada)
- Lógica de negocio compleja por cliente (portales con auth propia → caso especial)
- Migración de contenido existente (cada cliente arranca desde cero)

---

*Sistema sobre proyecto. Dato sobre opinión. Calma sobre euforia.*
*Believe Tech · BAAS™*
