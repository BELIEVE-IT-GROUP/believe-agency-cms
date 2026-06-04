import { getPayload } from 'payload'
import type { Where } from 'payload'

import config from '../src/payload.config.ts'

type TenantDoc = {
  id: number | string
  name?: string | null
  slug?: string | null
  domain?: string | null
  primaryColor?: string | null
  accentColor?: string | null
}

const tenantSlug = process.env.BOOTSTRAP_TENANT_SLUG || process.env.NEXT_PUBLIC_TENANT_SLUG || 'believe'
const siteName = process.env.BOOTSTRAP_SITE_NAME || process.env.NEXT_PUBLIC_SITE_NAME || 'Believe'
const domain = process.env.BOOTSTRAP_SITE_DOMAIN || process.env.NEXT_PUBLIC_SITE_DOMAIN || ''
const previewUrl = process.env.BOOTSTRAP_PREVIEW_URL || process.env.NEXT_PUBLIC_PREVIEW_URL || ''
const contactEmail =
  process.env.BOOTSTRAP_CONTACT_EMAIL ||
  process.env.DEFAULT_CONTACT_EMAIL ||
  process.env.SMTP_FROM_ADDRESS ||
  'hello@believe-global.com'
const revalidateWebhookUrl =
  process.env.BOOTSTRAP_REVALIDATE_WEBHOOK_URL ||
  process.env.PAYLOAD_REVALIDATE_WEBHOOK_URL ||
  (previewUrl ? `${previewUrl.replace(/\/$/, '')}/api/revalidate` : '')

function richText(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: null,
          children: [
            {
              type: 'text',
              text,
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

function appearance(
  background: 'default' | 'white' | 'gray' | 'primary' | 'dark' = 'default',
  sectionId?: string,
) {
  return {
    background,
    container: 'xl',
    spacingTop: 'lg',
    spacingBottom: 'lg',
    alignment: 'default',
    sectionId,
  }
}

async function findOne(payload: Awaited<ReturnType<typeof getPayload>>, collection: string, where: Where) {
  const result = await payload.find({
    collection: collection as never,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where,
  })

  return result.docs[0] as any
}

async function upsertBySlug({
  payload,
  collection,
  slug,
  data,
}: {
  payload: Awaited<ReturnType<typeof getPayload>>
  collection: 'pages' | 'posts' | 'categories'
  slug: string
  data: Record<string, unknown>
}) {
  const existing = await findOne(payload, collection, {
    slug: { equals: slug },
  })

  if (existing) {
    const updated = await (payload.update as any)({
      collection,
      id: existing.id,
      data,
      overrideAccess: true,
    })
    console.log(`[bootstrap-tenant-content] Updated ${collection}/${slug}`)
    return updated
  }

  const created = await (payload.create as any)({
    collection,
    data: { ...data, slug },
    overrideAccess: true,
  })
  console.log(`[bootstrap-tenant-content] Created ${collection}/${slug}`)
  return created
}

async function upsertSettings(payload: Awaited<ReturnType<typeof getPayload>>, tenant: TenantDoc) {
  const existing = await findOne(payload, 'settings', {
    tenant: { equals: tenant.id },
  })

  const data = {
    tenant: tenant.id,
    siteName,
    domain: domain || tenant.domain || '',
    previewUrl,
    revalidateWebhookUrl,
    header: {
      templateId: 'header.default',
      navLinks: [
        { label: 'Inicio', url: '/' },
        { label: 'Servicios', url: '/#servicios' },
        { label: 'Planes', url: '/#planes' },
        { label: 'Blog', url: '/blog' },
        { label: 'Contacto', url: '/contacto' },
      ],
      cta: {
        label: 'Hablemos',
        url: '/contacto',
      },
    },
    footer: {
      templateId: 'footer.default',
      text: `© ${new Date().getFullYear()} ${siteName}. Todos los derechos reservados.`,
      links: [
        { label: 'Inicio', url: '/', group: 'Sitio' },
        { label: 'Servicios', url: '/#servicios', group: 'Sitio' },
        { label: 'Blog', url: '/blog', group: 'Recursos' },
        { label: 'Contacto', url: '/contacto', group: 'Soporte' },
      ],
    },
    theme: {
      primaryColor: tenant.primaryColor || '#2563EB',
      accentColor: tenant.accentColor || '#0F766E',
    },
    socialLinks: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/believe-it-group' },
      { platform: 'instagram', url: 'https://www.instagram.com/believeitgroup' },
    ],
    contact: {
      defaultDestinationEmail: contactEmail,
      publicEmail: contactEmail,
      phone: process.env.BOOTSTRAP_PUBLIC_PHONE || '',
      address: process.env.BOOTSTRAP_PUBLIC_ADDRESS || '',
      mapUrl: process.env.BOOTSTRAP_MAP_URL || '',
    },
    newsletter: {
      listId: process.env.PLUNK_NEWSLETTER_LIST_ID || '',
      successMessage: 'Listo. Te enviaremos ideas accionables, no spam.',
    },
  }

  if (existing) {
    await (payload.update as any)({
      collection: 'settings',
      id: existing.id,
      data,
      overrideAccess: true,
    })
    console.log(`[bootstrap-tenant-content] Updated settings for ${tenantSlug}`)
    return
  }

  await (payload.create as any)({
    collection: 'settings',
    data,
    overrideAccess: true,
  })
  console.log(`[bootstrap-tenant-content] Created settings for ${tenantSlug}`)
}

async function getOrCreateTenant(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = (await findOne(payload, 'tenants', {
    slug: { equals: tenantSlug },
  })) as TenantDoc | undefined

  if (existing) return existing

  const tenant = await (payload.create as any)({
    collection: 'tenants',
    data: {
      name: siteName,
      slug: tenantSlug,
      domain,
      primaryColor: '#2563EB',
      accentColor: '#0F766E',
    },
    overrideAccess: true,
  })

  console.log(`[bootstrap-tenant-content] Created tenant ${tenantSlug}`)
  return tenant as TenantDoc
}

async function run(payloadConfig: any = config) {
  const payload = await getPayload({ config: payloadConfig })

  try {
    const tenant = await getOrCreateTenant(payload)

    await upsertSettings(payload, tenant)

    const category = await upsertBySlug({
      payload,
      collection: 'categories',
      slug: 'growth-digital',
      data: {
        tenant: tenant.id,
        name: 'Growth digital',
        description: 'Estrategia, diseño, automatización y tecnología aplicada al crecimiento.',
      },
    })

    const postData = [
      {
        slug: 'como-lanzar-una-web-operativa-sin-perder-semanas',
        title: 'Cómo lanzar una web operativa sin perder semanas',
        excerpt:
          'Un flujo práctico para pasar de idea a sitio editable, medible y listo para vender.',
        content:
          'La diferencia entre una web bonita y una web operativa está en el sistema: CMS claro, bloques reutilizables, formularios conectados, SEO base y despliegue confiable.',
      },
      {
        slug: 'por-que-un-cms-multitenant-acelera-tu-agencia',
        title: 'Por qué un CMS multitenant acelera tu agencia',
        excerpt:
          'Un solo backend para muchos clientes permite mantener calidad, velocidad y control editorial.',
        content:
          'Un CMS multitenant reduce duplicación, centraliza componentes y permite publicar experiencias distintas por cliente sin reconstruir todo desde cero.',
      },
      {
        slug: 'bloques-flowbite-pro-para-sitios-que-convierten',
        title: 'Bloques Flowbite Pro para sitios que convierten',
        excerpt:
          'Cómo usar bloques profesionales para montar páginas consistentes, editables y rápidas.',
        content:
          'Los bloques predefinidos aceleran el diseño, pero el valor real aparece cuando cada bloque está mapeado al CMS y listo para que el equipo edite contenido sin tocar código.',
      },
    ]

    for (const post of postData) {
      await upsertBySlug({
        payload,
        collection: 'posts',
        slug: post.slug,
        data: {
          tenant: tenant.id,
          title: post.title,
          excerpt: post.excerpt,
          content: richText(post.content),
          category: category.id,
          publishedAt: new Date().toISOString(),
          readTime: 4,
          _status: 'published',
          seo: {
            title: `${post.title} | ${siteName}`,
            description: post.excerpt,
          },
        },
      })
    }

    await upsertBySlug({
      payload,
      collection: 'pages',
      slug: 'home',
      data: {
        tenant: tenant.id,
        title: 'Home',
        _status: 'published',
        seo: {
          title: `${siteName} | Webs y sistemas digitales listos para crecer`,
          description:
            'Sitios, CMS multitenant y automatizaciones para lanzar experiencias digitales editables, profesionales y medibles.',
        },
        blocks: [
          {
            blockType: 'hero',
            templateId: 'hero.default',
            appearance: appearance('white'),
            variant: 'centered',
            badge: 'CMS multitenant + Flowbite Pro',
            headline: 'Webs editables, rápidas y listas para vender',
            subheadline:
              'Believe combina estrategia, diseño, desarrollo y automatización para crear sitios que tu equipo puede operar desde un CMS real.',
            ctas: [
              { text: 'Agendar diagnóstico', url: '/contacto', style: 'primary' },
              { text: 'Ver servicios', url: '/#servicios', style: 'secondary' },
            ],
          },
          {
            blockType: 'stats',
            templateId: 'stats.default',
            appearance: appearance('gray'),
            headline: 'Una base sólida para operar muchos sitios',
            items: [
              { value: '118+', label: 'templates CMS', description: 'Flowbite Pro mapeados por tipo de bloque.' },
              { value: '15', label: 'bloques editables', description: 'Hero, pricing, FAQ, blog, forms y más.' },
              { value: '1', label: 'CMS multitenant', description: 'Una operación central para múltiples clientes.' },
            ],
          },
          {
            blockType: 'features',
            templateId: 'features.default',
            appearance: appearance('white', 'servicios'),
            headline: 'Todo lo necesario para pasar de maqueta a operación',
            subheadline:
              'No es una landing suelta. Es un sistema de contenido con componentes reutilizables y rutas preparadas.',
            layout: 'grid-3',
            items: [
              {
                icon: 'CMS',
                title: 'Contenido editable',
                description:
                  'Páginas, posts, settings, navegación, formularios y SEO controlados desde Payload CMS.',
              },
              {
                icon: 'UI',
                title: 'Bloques Flowbite Pro',
                description:
                  'Cada sección puede elegir template, apariencia, espaciado, fondo y contenido desde el admin.',
              },
              {
                icon: 'API',
                title: 'Integración lista',
                description:
                  'Frontend conectado al tenant, revalidación ISR, preview, contacto y newsletter.',
              },
            ],
          },
          {
            blockType: 'split-content',
            templateId: 'split-content.two-columns',
            appearance: appearance('gray'),
            headline: 'Un starter que se siente como producto, no como demo',
            body: richText(
              'El frontend consume contenido real del tenant, renderiza bloques por template y mantiene fallbacks solo para estados vacíos. Cuando publicas desde el CMS, la web deja de ser estática y empieza a operar.',
            ),
            imagePosition: 'right',
            cta: { text: 'Hablar con Believe', url: '/contacto' },
          },
          {
            blockType: 'pricing',
            templateId: 'pricing.default',
            appearance: appearance('white', 'planes'),
            headline: 'Planes para construir y escalar',
            subheadline: 'Elige el punto de partida y evoluciona sin rehacer la base técnica.',
            plans: [
              {
                name: 'Launch',
                price: 'Desde USD 1.500',
                description: 'Sitio editable con CMS, páginas base y formularios.',
                features: [
                  { feature: 'Home y contacto' },
                  { feature: 'Bloques CMS esenciales' },
                  { feature: 'Deploy y configuración inicial' },
                ],
                ctaText: 'Empezar',
                ctaUrl: '/contacto',
              },
              {
                name: 'Growth',
                price: 'Desde USD 3.500',
                description: 'Sistema multitenant con blog, SEO, settings y automatizaciones.',
                features: [
                  { feature: 'Todo Launch' },
                  { feature: 'Blog y contenido programable' },
                  { feature: 'Revalidación y preview' },
                ],
                ctaText: 'Escalar',
                ctaUrl: '/contacto',
                highlighted: true,
                badge: 'Recomendado',
              },
              {
                name: 'Platform',
                price: 'A medida',
                description: 'Arquitectura para operar varios clientes, marcas o unidades de negocio.',
                features: [
                  { feature: 'Todo Growth' },
                  { feature: 'Flujos personalizados' },
                  { feature: 'Soporte y evolución continua' },
                ],
                ctaText: 'Diseñar plataforma',
                ctaUrl: '/contacto',
              },
            ],
          },
          {
            blockType: 'testimonials',
            templateId: 'testimonials.grid-layout-cards',
            appearance: appearance('gray'),
            headline: 'Pensado para equipos que necesitan velocidad y control',
            layout: 'grid',
            items: [
              {
                name: 'Equipo comercial',
                role: 'Operación digital',
                company: siteName,
                quote:
                  'Podemos cambiar mensajes, secciones y CTAs sin esperar un ciclo completo de desarrollo.',
                rating: 5,
              },
              {
                name: 'Equipo marketing',
                role: 'Contenido y growth',
                company: siteName,
                quote:
                  'Los bloques nos dan consistencia visual y suficiente flexibilidad para lanzar campañas rápido.',
                rating: 5,
              },
            ],
          },
          {
            blockType: 'faq',
            templateId: 'faq.accordion',
            appearance: appearance('white'),
            headline: 'Preguntas frecuentes',
            subheadline: 'Lo básico para entender cómo opera este starter.',
            items: [
              {
                question: '¿La web se edita desde el CMS?',
                answer: richText('Sí. Las páginas publicadas del tenant alimentan el frontend con bloques editables.'),
              },
              {
                question: '¿Los templates Flowbite Pro están disponibles?',
                answer: richText('Sí. El CMS expone las variantes mapeadas por tipo de bloque para usarlas en cualquier proyecto web.'),
              },
              {
                question: '¿Necesito tocar código para cambiar el contenido?',
                answer: richText('No para contenido, navegación, textos, CTAs y la mayoría de secciones. El código queda para evolución del sistema.'),
              },
            ],
          },
          {
            blockType: 'blog-list',
            templateId: 'blog-list.default',
            appearance: appearance('gray'),
            headline: 'Ideas recientes',
            count: 3,
            layout: 'grid',
            cta: { text: 'Ver blog', url: '/blog' },
          },
          {
            blockType: 'cta',
            templateId: 'cta.default',
            appearance: appearance('primary'),
            variant: 'banner',
            headline: 'Construyamos una web que tu equipo sí pueda operar',
            subheadline:
              'Arranca con una base CMS real, templates profesionales y flujo de deploy listo.',
            ctas: [
              { text: 'Agendar llamada', url: '/contacto', style: 'primary' },
              { text: 'Leer el blog', url: '/blog', style: 'outline' },
            ],
          },
          {
            blockType: 'newsletter',
            templateId: 'newsletter.default',
            appearance: appearance('white'),
            headline: 'Recibe ideas para mejorar tu operación digital',
            subheadline: 'Contenido breve sobre CMS, automatización, diseño y growth.',
            placeholder: 'tu@email.com',
            ctaText: 'Suscribirme',
            successMessage: 'Listo. Te enviaremos ideas accionables, no spam.',
            destinationEmail: contactEmail,
          },
        ],
      },
    })

    await upsertBySlug({
      payload,
      collection: 'pages',
      slug: 'contacto',
      data: {
        tenant: tenant.id,
        title: 'Contacto',
        _status: 'published',
        seo: {
          title: `Contacto | ${siteName}`,
          description: 'Cuéntanos qué quieres construir y te ayudamos a definir el siguiente paso.',
        },
        blocks: [
          {
            blockType: 'hero',
            templateId: 'hero.default',
            appearance: appearance('gray'),
            variant: 'centered',
            badge: 'Contacto',
            headline: 'Cuéntanos qué quieres construir',
            subheadline:
              'Te respondemos con una ruta clara para convertir tu idea en una web editable, medible y lista para operar.',
            ctas: [{ text: 'Enviar mensaje', url: '#formulario', style: 'primary' }],
          },
          {
            blockType: 'contact',
            templateId: 'contact.default',
            appearance: appearance('white', 'formulario'),
            headline: 'Hablemos de tu proyecto',
            subheadline:
              'Completa el formulario y revisaremos contigo alcance, tiempos, contenido y despliegue.',
            destinationEmail: contactEmail,
            successMessage: 'Mensaje recibido. Te contactaremos pronto.',
            fields: [
              { fieldName: 'name', label: 'Nombre', type: 'text', required: true, placeholder: 'Tu nombre' },
              { fieldName: 'email', label: 'Email', type: 'email', required: true, placeholder: 'tu@email.com' },
              { fieldName: 'company', label: 'Empresa', type: 'text', required: false, placeholder: 'Nombre de la empresa' },
              {
                fieldName: 'need',
                label: 'Qué necesitas',
                type: 'select',
                required: true,
                placeholder: 'Selecciona una opción',
                options: [
                  { label: 'Nueva web con CMS', value: 'new-cms-website' },
                  { label: 'Migrar una web existente', value: 'migration' },
                  { label: 'Sistema multitenant', value: 'multitenant' },
                  { label: 'Automatización o integración', value: 'automation' },
                ],
              },
              { fieldName: 'message', label: 'Mensaje', type: 'textarea', required: true, placeholder: 'Cuéntanos el contexto' },
            ],
          },
          {
            blockType: 'faq',
            templateId: 'faq.default',
            appearance: appearance('gray'),
            headline: 'Antes de la llamada',
            items: [
              {
                question: '¿Qué debo tener listo?',
                answer: richText('Si tienes logo, dominio, referencias o contenido inicial, perfecto. Si no, podemos ayudarte a definirlo.'),
              },
              {
                question: '¿Pueden trabajar sobre una base existente?',
                answer: richText('Sí. Podemos auditar la web actual y decidir si conviene migrar, refactorizar o construir sobre este starter.'),
              },
            ],
          },
        ],
      },
    })

    console.log(`[bootstrap-tenant-content] Done. Tenant "${tenantSlug}" has settings, pages, posts and Flowbite blocks.`)
  } finally {
    await payload.destroy()
  }
}

export async function script(payloadConfig: any) {
  await run(payloadConfig)
}
