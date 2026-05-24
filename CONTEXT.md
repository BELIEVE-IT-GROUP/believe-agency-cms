# Believe Agency CMS — Contexto de sesión

## Estado del proyecto (2026-05-24)

### Admin funcionando
- URL: https://cms.believe-global.com/admin
- Stack: Payload 3.84.1 · Next.js 15 · Postgres · Coolify VPS
- Repo: BELIEVE-IT-GROUP/believe-agency-cms (main)

### Lo que está operativo
- ✅ Multi-tenant (plugin-multi-tenant) — tenants aislados
- ✅ Drafts + autosave — Pages y Posts
- ✅ Versions — Pages y Posts  
- ✅ Live Preview — configurado, necesita NEXT_PUBLIC_PREVIEW_URL del frontend
- ✅ 15 bloques definidos en Payload (Hero → Newsletter)
- ✅ importMap completo (richtext-lexical, storage-s3, multi-tenant, next/rsc)
- ✅ Storage R2 (Cloudflare) para media
- ✅ SMTP vía Plunk para emails

### Colecciones
- Tenants, Users, Pages, Posts, Media, Categories

### Variables de entorno en Coolify
DATABASE_URI, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_PUBLIC_URL
SMTP_HOST/PORT/USER/PASS cuando se configure

### Próximo paso crítico: Step 8 del blueprint
Crear repo `believe-web-starter` (BELIEVE-IT-GROUP) con:
- Next.js 15 + Tailwind + Flowbite Blocks Pro
- Block renderer dinámico
- 15 componentes de bloque con Flowbite Pro
- ISR con webhook revalidation desde Payload
- Preview API route para live preview

Ver BLUEPRINT.md para el detalle completo.
