# FLOWBITE PRO BLUEPRINT V3

**Objetivo:** convertir Believe CMS en un catálogo editable de bloques Flowbite React Blocks para generar webs multi-tenant con Payload + Next.

**Fuente Flowbite Pro local:** `flowbite-react-blocks-1.8.0-beta/`

---

## 1. Principio de arquitectura

Flowbite React Blocks no se usa como paquete importable. El propio README del catálogo indica que los bloques se copian desde archivos `.tsx` hacia el proyecto que los consume.

Por eso el contrato correcto es:

1. Payload CMS guarda `blockType`, `templateId`, contenido y `appearance`.
2. `src/flowbite/registry.ts` lista todos los templates disponibles y el archivo Flowbite original.
3. `believe-web-starter` copia/adapta esos bloques a componentes dinámicos.
4. `BlockRenderer` elige componente por `blockType + templateId`.

---

## 2. Estado aplicado en CMS

El CMS ya tiene:

- Registry único: `src/flowbite/registry.ts`
- Catálogo completo: `src/flowbite/catalog.ts`
- Helper de campos Payload: `src/flowbite/payloadFields.ts`
- Los 15 bloques de `src/blocks/` con:
  - `templateId`
  - `appearance`
- Colección `settings` tenant-scoped con templates de header/footer, nav, footer, theme, socials, contact, newsletter y analytics.
- Hooks `afterChange` en `pages`, `posts` y `settings` para llamar al webhook ISR del frontend.
- Hook de unicidad para permitir solo un documento `settings` por tenant.
- Script idempotente `npm run bootstrap:settings` para crear/actualizar `settings` por tenant.

Bloques cubiertos:

- `hero`
- `features`
- `pricing`
- `testimonials`
- `cta`
- `faq`
- `stats`
- `team`
- `logo-cloud`
- `gallery`
- `contact`
- `split-content`
- `video-embed`
- `newsletter`
- `blog-list`

El registry también incluye templates de `header` y `footer`, ya conectados a la colección `Settings`.

Cobertura auditada del catálogo local:

- 355 templates `.tsx` reales inventariados en `flowbiteCatalog`.
- 133 opciones conectadas al page builder CMS como templates de bloques web/layout.
- 224 templates adicionales quedan inventariados para fases de app/dashboard/e-commerce operativo: application shells, tables, drawers, modals, CRUD, payment forms, shopping cart, auth forms, popups, cookies, errors, etc.
- 0 paths rotos detectados en el registry CMS.

---

## 3. Mapa Flowbite Pro por bloque

| CMS block | Categorías Flowbite mapeadas |
|---|---|
| `hero` | `marketing-ui/hero-sections`, `ecommerce-ui/storefront-hero-sections` |
| `features` | `marketing-ui/feature-sections` |
| `pricing` | `marketing-ui/pricing-tables` |
| `testimonials` | `marketing-ui/testimonials` |
| `cta` | `marketing-ui/cta-sections`, `marketing-ui/banners` |
| `faq` | `marketing-ui/faq-sections`, `ecommerce-ui/customer-service` |
| `stats` | `marketing-ui/social-proof`, `marketing-ui/content-sections/social-proof` |
| `team` | `marketing-ui/team-sections` |
| `logo-cloud` | `marketing-ui/customer-logos` |
| `gallery` | `marketing-ui/content-sections/image-gallery`, `marketing-ui/project-portfolio` |
| `contact` | `marketing-ui/contact-forms` |
| `split-content` | `marketing-ui/content-sections` |
| `video-embed` | `marketing-ui/content-sections/video-embed`, selected hero video variants |
| `newsletter` | `marketing-ui/newsletter-sections` |
| `blog-list` | `marketing-ui/blog-sections`, `publisher-ui/related-articles` |
| `header` | `marketing-ui/headers` |
| `footer` | `marketing-ui/footer-sections` |

---

## 4. Contrato de datos CMS -> frontend

Cada bloque renderizable debe exponer:

```ts
{
  blockType: string
  templateId: string
  appearance?: {
    background?: 'default' | 'white' | 'gray' | 'primary' | 'dark' | 'image'
    container?: 'default' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
    spacingTop?: 'default' | 'none' | 'sm' | 'md' | 'lg'
    spacingBottom?: 'default' | 'none' | 'sm' | 'md' | 'lg'
    alignment?: 'default' | 'left' | 'center' | 'right'
    sectionId?: string
    customClassName?: string
  }
}
```

El frontend no debe inferir templates por `layout` antiguo. `layout` puede seguir existiendo por compatibilidad, pero `templateId` manda.

---

## 5. Estado aplicado en `believe-web-starter`

El starter ya tiene:

- Registry runtime: `src/components/flowbite-pro/registry.ts`
- Renderer dinámico: `src/components/blocks/BlockRenderer.tsx`
- Página showcase: `/flowbite-pro-showcase`
- Fetch multi-tenant por `NEXT_PUBLIC_TENANT_SLUG` con fallback legacy a `NEXT_PUBLIC_TENANT_ID`
- Cache tags: `payload_pages`, `payload_posts`, `payload_settings`
- Header/footer desde `Settings`
- CSS variables desde `settings.theme`
- Preview mode:
  - `/api/preview`
  - `/api/exit-preview`
- ISR webhook:
  - `/api/revalidate`
  - acepta `{ paths, tags }`
  - acepta `{ collection, slug }`
- Forms:
  - `/api/contact`
  - `/api/newsletter`
- Rich text renderer para campos Payload Lexical.
- Normalizador de URLs de media del CMS.
- Aplicación real de `appearance` en los wrappers: background, container, spacing, alignment básico, `sectionId` y `customClassName`.

Los 15 bloques CMS ya tienen wrapper mínimo funcional:

- `hero`
- `features`
- `pricing`
- `testimonials`
- `cta`
- `faq`
- `stats`
- `team`
- `logo-cloud`
- `gallery`
- `contact`
- `split-content`
- `video-embed`
- `newsletter`
- `blog-list`

Notas de compatibilidad aplicadas:

- `pricing` acepta `plans` del CMS y `tiers` legacy.
- `testimonials` acepta `name/photo/rating` del CMS y `author/avatar` legacy.
- `split-content` acepta `imagePosition` y `cta` del CMS, más `layout/ctas` legacy.
- `faq` renderiza rich text en `answer`.
- `blog-list` trae posts publicados automáticamente usando `count` si no recibe posts manuales.
- `features` soporta imagen del CMS o fallback SVG.
- `appearance` ya afecta el layout base de los 15 bloques.
- El starter ya no muestra contenido demo como fallback de producción; la demo vive solo en `/flowbite-pro-showcase`.
- Los campos `select` del bloque contact tienen opciones editables y render real en frontend.

---

## 6. Trabajo pendiente en CMS

Para que el sistema quede realmente 100% operativo falta:

- Crear colección/global `Settings` tenant-scoped. **Hecho como colección `settings`.**
- Usar registry para templates de header y footer. **Hecho en `settings.header.templateId` y `settings.footer.templateId`.**
- Agregar hooks `afterChange` en Pages y Posts para ISR. **Hecho.**
- Crear o documentar endpoints de contact/newsletter. **Hecho en el frontend.**
- Generar `src/payload-types.ts`. **Hecho. El config usa carga dinámica de Lexical para que el CLI no choque con top-level await.**
- Actualizar `.env.example` con `REVALIDATE_SECRET`, Plunk y preview. **Hecho.**
- Crear bootstrap para `settings` por tenant. **Hecho con `npm run bootstrap:settings`.**
- Probar Payload Live Preview contra el frontend.

---

## 7. Gates de aceptación

El sistema no se considera listo hasta pasar estos gates:

1. `npm run build` pasa en CMS. **Pasa.**
2. `npm run build` pasa en `believe-web-starter`. **Pasa.**
3. `npm run typecheck` pasa en `believe-web-starter`. **Pasa.**
4. `npm run generate:types` pasa y versiona `src/payload-types.ts`. **Pasa.**
5. Los 15 bloques muestran `templateId` en el admin. **Implementado; requiere revisar en admin tras deploy.**
6. Cada `templateId` apunta a un archivo real del catálogo Flowbite. **Implementado en registry CMS.**
7. `believe-web-starter` renderiza una página showcase con los 15 bloques. **Implementado.**
8. No hay fallbacks demo visibles en producción. **Implementado; home/blog/post ya no caen a contenido demo.**
9. Preview muestra drafts. **Implementado a nivel API; requiere QA con Payload desplegado.**
10. Revalidation actualiza en menos de 5 segundos. **Implementado a nivel webhook; requiere QA de deploy.**
11. Contact/newsletter funcionan con una prueba real. **Endpoints listos; requiere variables Plunk y prueba real.**
12. Header/footer vienen de `Settings`. **Implementado; el CMS remoto actual aún devuelve 404 en `/api/settings` hasta desplegar la colección.**
13. Lighthouse mobile Performance > 90, Accessibility > 95, SEO > 95. **Pendiente de auditoría contra deploy.**

---

## 8. Orden recomendado

1. Desplegar CMS con colección `settings`, registry y hooks.
2. Crear/llenar un documento `settings` por tenant desde admin o con `npm run bootstrap:settings`.
3. Cambiar el starter a `NEXT_PUBLIC_TENANT_SLUG` en todos los entornos.
4. Ejecutar `npm run generate:types` y `npm run generate:importmap` después de cambios de schema.
5. Probar admin: crear una página con los 15 bloques y escoger varios `templateId`.
6. Probar `/flowbite-pro-showcase`.
7. Probar preview desde Payload.
8. Probar revalidation editando una página, un post y settings.
9. Probar contact/newsletter con `PLUNK_API_KEY`.
10. Correr Lighthouse contra el deploy final.

## 9. Alcance real de "100% Flowbite Pro"

El sistema ya está preparado para seleccionar cualquier template web/layout mapeado desde el CMS, y el catálogo local completo está inventariado. El frontend usa wrappers base por bloque. Eso significa:

- **100% inventariado:** los 355 templates reales del catálogo local están en `flowbiteCatalog`.
- **100% mapeado para page builder web:** 133 templates están disponibles como `templateId` en los bloques CMS y Settings.
- **100% funcional base:** los 15 tipos de bloque renderizan con datos reales del CMS.
- **No 100% pixel-perfect por template:** para que cada template Flowbite Pro tenga su layout exacto, hay que copiar/adaptar cada `.tsx` del catálogo dentro del starter y registrar componentes por `templateId`, no solo por `blockType`.
- **No todos los 355 deben ser bloques de página:** Application UI, CRUD layouts, drawers, table headers, side navigation, payment forms y shopping cart pertenecen a app/e-commerce surfaces separadas. Están inventariados, pero requieren collections/bloques específicos antes de exponerlos en un page builder general.

Fase final opcional para pixel-perfect:

1. Crear `src/components/flowbite-pro/templates/<block>/<template>.tsx`.
2. Copiar/adaptar cada template real desde `flowbite-react-blocks-1.8.0-beta`.
3. Agregar adapters por template cuando el shape visual lo requiera.
4. Cambiar registry del starter de alias por `blockType` a resolución exacta por `templateId`.
5. Mantener wrappers base como fallback seguro.
