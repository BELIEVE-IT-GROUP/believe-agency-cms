# Deployment QA

## CMS

Run before deploy:

```bash
npm run check:flowbite
npm run generate:types
npm run generate:importmap
npm run build
```

After deploy, create or update tenant settings:

```bash
BOOTSTRAP_TENANT_SLUG=clientex \
BOOTSTRAP_SITE_NAME="Cliente X" \
BOOTSTRAP_PREVIEW_URL=https://clientex.com \
BOOTSTRAP_REVALIDATE_WEBHOOK_URL=https://clientex.com/api/revalidate \
npm run bootstrap:settings
```

Required CMS env:

- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_PREVIEW_URL`
- `PAYLOAD_REVALIDATE_SECRET`
- R2 env variables for media storage

## Database Schema

This project currently uses Payload schema push:

```txt
PAYLOAD_DB_PUSH !== false
```

For this release, deploy the CMS with schema push enabled so Payload creates the new `settings` collection and block field columns automatically.

Do not switch production to `PAYLOAD_DB_PUSH=false` until a migration baseline has been created from the current production schema. The repo now includes migration scripts for the next hardening pass:

```bash
npm run migrate:create -- flowbite-settings
npm run migrate:status
npm run migrate
```

## Web Starter

Run before deploy:

```bash
npm run typecheck
npm run build
```

Required frontend env:

- `NEXT_PUBLIC_PAYLOAD_URL`
- `NEXT_PUBLIC_TENANT_SLUG`
- `REVALIDATE_SECRET`
- `PREVIEW_SECRET`
- `DEFAULT_CONTACT_EMAIL`
- `PLUNK_API_KEY` if newsletter/contact automation should send externally

After both deployments are live:

```bash
FRONTEND_URL=https://clientex.com npm run smoke:production
```

Dry-run the smoke test without network calls:

```bash
FRONTEND_URL=https://clientex.com npm run smoke:production -- --dry-run
```

## Manual Gates

- `/api/settings` on CMS returns one document for the tenant.
- Header and footer render from `Settings`.
- A page edit in CMS revalidates the frontend.
- A post edit in CMS revalidates `/blog` and the post page.
- Payload preview opens drafts in the frontend.
- Contact and newsletter forms submit successfully.
- `/flowbite-pro-showcase` renders all 15 CMS block types.
