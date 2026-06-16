import type { CollectionConfig } from 'payload'
import { byTenant, byTenantOrPublished } from '../access/byTenant.ts'

/**
 * Landings — contenido editable de landings standalone (ej. 'birdman').
 *
 * El campo `content` (group) ESPEJA la interface BirdmanContent del frontend
 * (src/app/birdman/content.ts). Cada sub-group corresponde a una sección de la
 * landing; los campos están tipados según content.ts. Todo es opcional salvo
 * `slug` — el frontend hace fetch de esta collection y mergea sobre el default
 * content.ts, así que cualquier campo vacío cae al valor por defecto.
 *
 * Multi-tenant: el plugin inyecta el campo `tenant` y scopa por tenant igual
 * que Pages/Posts. El slug es único por tenant.
 */

// --- Sub-field helpers reutilizados a lo largo de las secciones --------------

/** NavLink / FooterColumn.links: { label, href } */
const linkFields = [
  { name: 'label', type: 'text' as const, label: 'Texto' },
  { name: 'href', type: 'text' as const, label: 'URL' },
]

/** CtaLink: { label, href, style? } */
const ctaGroup = (name: string, label: string) => ({
  name,
  type: 'group' as const,
  label,
  fields: [
    { name: 'label', type: 'text' as const, label: 'Texto' },
    { name: 'href', type: 'text' as const, label: 'URL' },
    {
      name: 'style',
      type: 'select' as const,
      label: 'Estilo',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Ghost', value: 'ghost' },
      ],
    },
  ],
})

/** HeroKpi / TechPanelKpi: { k, v, d, warn? } */
const kpiFields = [
  { name: 'k', type: 'text' as const, label: 'Etiqueta (k)' },
  { name: 'v', type: 'text' as const, label: 'Valor (v)' },
  { name: 'd', type: 'text' as const, label: 'Delta (d)' },
  { name: 'warn', type: 'checkbox' as const, label: 'Warn (naranja en vez de verde)' },
]

/** HeroTrack / TechPanelTrack: { id, dest, status, type } */
const trackFields = [
  { name: 'id', type: 'text' as const, label: 'ID' },
  { name: 'dest', type: 'text' as const, label: 'Destino' },
  { name: 'status', type: 'text' as const, label: 'Estado' },
  {
    name: 'type',
    type: 'select' as const,
    label: 'Tipo de pill',
    options: [
      { label: 'OK (verde)', value: 'ok' },
      { label: 'GO (naranja)', value: 'go' },
    ],
  },
]

/** { label, delta } */
const chartGroup = {
  name: 'chart',
  type: 'group' as const,
  label: 'Chart',
  fields: [
    { name: 'label', type: 'text' as const, label: 'Etiqueta' },
    { name: 'delta', type: 'text' as const, label: 'Delta' },
  ],
}

/** HeroPanel / tecnologia.panel: { ttl, live, kpis[], chart, tracking[] } */
const panelFields = [
  { name: 'ttl', type: 'text' as const, label: 'Título del panel' },
  { name: 'live', type: 'text' as const, label: 'Texto "En vivo"' },
  { name: 'kpis', type: 'array' as const, label: 'KPIs', fields: kpiFields },
  chartGroup,
  { name: 'tracking', type: 'array' as const, label: 'Tracking', fields: trackFields },
]

export const Landings: CollectionConfig = {
  slug: 'landings',
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    defaultColumns: ['title', 'slug', '_status'],
    description:
      'Landings standalone con contenido editable campo por campo (espeja BirdmanContent).',
  },
  versions: { drafts: { autosave: true } },
  access: {
    read: byTenantOrPublished,
    create: byTenant,
    update: byTenant,
    delete: byTenant,
  },
  fields: [
    { name: 'title', type: 'text', label: 'Título interno de la landing' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'Identificador de la landing. Ej: "birdman".' },
    },
    {
      name: 'content',
      type: 'group',
      label: 'Contenido de la landing',
      admin: {
        description:
          'Espeja BirdmanContent. Todo es opcional: lo que dejes vacío cae al default del frontend.',
      },
      fields: [
        // --- meta ------------------------------------------------------------
        {
          name: 'meta',
          type: 'group',
          label: 'Meta (SEO)',
          fields: [
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'description', type: 'textarea', label: 'Description' },
          ],
        },
        // --- nav -------------------------------------------------------------
        {
          name: 'nav',
          type: 'group',
          label: 'Navegación',
          fields: [
            { name: 'brand', type: 'text', label: 'Marca' },
            { name: 'links', type: 'array', label: 'Links', fields: linkFields },
            ctaGroup('cta', 'CTA'),
          ],
        },
        // --- hero ------------------------------------------------------------
        {
          name: 'hero',
          type: 'group',
          label: 'Hero',
          fields: [
            { name: 'tag', type: 'text', label: 'Tag' },
            { name: 'headlineBefore', type: 'text', label: 'Headline (antes)' },
            { name: 'headlineEm', type: 'text', label: 'Headline (énfasis)' },
            { name: 'headlineAfter', type: 'text', label: 'Headline (después)' },
            { name: 'sub', type: 'textarea', label: 'Subtítulo' },
            {
              name: 'ctas',
              type: 'array',
              label: 'CTAs',
              fields: [
                { name: 'label', type: 'text', label: 'Texto' },
                { name: 'href', type: 'text', label: 'URL' },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Estilo',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Ghost', value: 'ghost' },
                  ],
                },
              ],
            },
            { name: 'note', type: 'textarea', label: 'Nota' },
            { name: 'noteStrong', type: 'textarea', label: 'Nota (negrita)' },
            { name: 'panel', type: 'group', label: 'Panel', fields: panelFields },
          ],
        },
        // --- queHacemos ------------------------------------------------------
        {
          name: 'queHacemos',
          type: 'group',
          label: 'Qué hacemos',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            { name: 'lead', type: 'textarea', label: 'Lead' },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [
                { name: 'title', type: 'text', label: 'Título' },
                { name: 'desc', type: 'textarea', label: 'Descripción' },
              ],
            },
          ],
        },
        // --- problemas -------------------------------------------------------
        {
          name: 'problemas',
          type: 'group',
          label: 'Problemas',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            { name: 'lead', type: 'textarea', label: 'Lead' },
            {
              name: 'items',
              type: 'array',
              label: 'Items (lista de problemas)',
              fields: [{ name: 'value', type: 'text', label: 'Problema' }],
            },
            {
              name: 'ctaBand',
              type: 'group',
              label: 'Banda CTA',
              fields: [
                { name: 'text', type: 'textarea', label: 'Texto' },
                ctaGroup('cta', 'CTA'),
              ],
            },
          ],
        },
        // --- soluciones ------------------------------------------------------
        {
          name: 'soluciones',
          type: 'group',
          label: 'Soluciones',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [
                { name: 'title', type: 'text', label: 'Título' },
                { name: 'body', type: 'textarea', label: 'Cuerpo (admite HTML)' },
                {
                  name: 'chips',
                  type: 'array',
                  label: 'Chips',
                  fields: [{ name: 'value', type: 'text', label: 'Chip' }],
                },
              ],
            },
          ],
        },
        // --- industrias ------------------------------------------------------
        {
          name: 'industrias',
          type: 'group',
          label: 'Industrias',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'items',
              type: 'array',
              label: 'Items (lista de industrias)',
              fields: [{ name: 'value', type: 'text', label: 'Industria' }],
            },
          ],
        },
        // --- beneficios ------------------------------------------------------
        {
          name: 'beneficios',
          type: 'group',
          label: 'Beneficios',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [
                { name: 'label', type: 'text', label: 'Etiqueta' },
                { name: 'desc', type: 'textarea', label: 'Descripción' },
                {
                  name: 'dir',
                  type: 'select',
                  label: 'Dirección',
                  options: [
                    { label: 'Up (sube)', value: 'up' },
                    { label: 'Down (baja)', value: 'down' },
                  ],
                },
              ],
            },
          ],
        },
        // --- tecnologia ------------------------------------------------------
        {
          name: 'tecnologia',
          type: 'group',
          label: 'Tecnología',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            { name: 'lead', type: 'textarea', label: 'Lead' },
            {
              name: 'ticks',
              type: 'array',
              label: 'Ticks (bullets)',
              fields: [{ name: 'value', type: 'text', label: 'Tick' }],
            },
            { name: 'panel', type: 'group', label: 'Panel', fields: panelFields },
          ],
        },
        // --- metodologia -----------------------------------------------------
        {
          name: 'metodologia',
          type: 'group',
          label: 'Metodología',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'steps',
              type: 'array',
              label: 'Pasos',
              fields: [{ name: 'value', type: 'text', label: 'Paso' }],
            },
          ],
        },
        // --- casos -----------------------------------------------------------
        {
          name: 'casos',
          type: 'group',
          label: 'Casos de éxito',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [
                { name: 'industry', type: 'text', label: 'Industria' },
                { name: 'problem', type: 'textarea', label: 'Problema' },
                { name: 'solution', type: 'textarea', label: 'Solución' },
                {
                  name: 'results',
                  type: 'array',
                  label: 'Resultados',
                  fields: [
                    { name: 'n', type: 'text', label: 'Número (n)' },
                    { name: 'l', type: 'text', label: 'Etiqueta (l)' },
                  ],
                },
              ],
            },
            { name: 'disclaimer', type: 'textarea', label: 'Disclaimer' },
          ],
        },
        // --- calculadora -----------------------------------------------------
        {
          name: 'calculadora',
          type: 'group',
          label: 'Calculadora',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            { name: 'lead', type: 'textarea', label: 'Lead' },
            {
              name: 'fields',
              type: 'group',
              label: 'Campos del formulario',
              fields: [
                { name: 'enviosLabel', type: 'text', label: 'Envíos — label' },
                { name: 'enviosDefault', type: 'text', label: 'Envíos — default' },
                { name: 'costoLabel', type: 'text', label: 'Costo — label' },
                { name: 'costoDefault', type: 'text', label: 'Costo — default' },
                { name: 'opsLabel', type: 'text', label: 'Ops — label' },
                { name: 'opsDefault', type: 'text', label: 'Ops — default' },
                { name: 'opsHint', type: 'textarea', label: 'Ops — hint' },
              ],
            },
            { name: 'rate', type: 'number', label: 'Rate (ej. 0.14)' },
            {
              name: 'labels',
              type: 'group',
              label: 'Labels de resultados',
              fields: [
                { name: 'annualK', type: 'text', label: 'Annual K' },
                { name: 'saveK', type: 'text', label: 'Save K' },
                { name: 'perBefore', type: 'text', label: 'Per (antes)' },
                { name: 'perAfter', type: 'text', label: 'Per (después)' },
              ],
            },
            { name: 'assume', type: 'textarea', label: 'Assume (admite HTML)' },
            ctaGroup('cta', 'CTA'),
          ],
        },
        // --- diagnostico -----------------------------------------------------
        {
          name: 'diagnostico',
          type: 'group',
          label: 'Diagnóstico',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            { name: 'lead', type: 'textarea', label: 'Lead' },
            {
              name: 'ticks',
              type: 'array',
              label: 'Ticks (bullets)',
              fields: [{ name: 'value', type: 'text', label: 'Tick' }],
            },
            {
              name: 'form',
              type: 'group',
              label: 'Formulario',
              fields: [
                { name: 'empresaLabel', type: 'text', label: 'Empresa — label' },
                { name: 'empresaPlaceholder', type: 'text', label: 'Empresa — placeholder' },
                { name: 'empresaError', type: 'text', label: 'Empresa — error' },
                { name: 'industriaLabel', type: 'text', label: 'Industria — label' },
                { name: 'industriaPlaceholder', type: 'text', label: 'Industria — placeholder' },
                {
                  name: 'industriaOptions',
                  type: 'array',
                  label: 'Industria — opciones',
                  fields: [{ name: 'value', type: 'text', label: 'Opción' }],
                },
                { name: 'industriaError', type: 'text', label: 'Industria — error' },
                { name: 'volumenLabel', type: 'text', label: 'Volumen — label' },
                { name: 'volumenPlaceholder', type: 'text', label: 'Volumen — placeholder' },
                {
                  name: 'volumenOptions',
                  type: 'array',
                  label: 'Volumen — opciones',
                  fields: [{ name: 'value', type: 'text', label: 'Opción' }],
                },
                { name: 'volumenError', type: 'text', label: 'Volumen — error' },
                { name: 'estadoLabel', type: 'text', label: 'Estado — label' },
                { name: 'estadoPlaceholder', type: 'text', label: 'Estado — placeholder' },
                { name: 'estadoError', type: 'text', label: 'Estado — error' },
                { name: 'correoLabel', type: 'text', label: 'Correo — label' },
                { name: 'correoPlaceholder', type: 'text', label: 'Correo — placeholder' },
                { name: 'correoError', type: 'text', label: 'Correo — error' },
                { name: 'telLabel', type: 'text', label: 'Teléfono — label' },
                { name: 'telPlaceholder', type: 'text', label: 'Teléfono — placeholder' },
                { name: 'telError', type: 'text', label: 'Teléfono — error' },
                { name: 'submit', type: 'text', label: 'Botón submit' },
                { name: 'legal', type: 'textarea', label: 'Texto legal' },
                {
                  name: 'success',
                  type: 'group',
                  label: 'Éxito',
                  fields: [
                    { name: 'title', type: 'text', label: 'Título' },
                    { name: 'text', type: 'textarea', label: 'Texto' },
                  ],
                },
              ],
            },
          ],
        },
        // --- recursos --------------------------------------------------------
        {
          name: 'recursos',
          type: 'group',
          label: 'Recursos',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [
                { name: 'type', type: 'text', label: 'Tipo' },
                { name: 'title', type: 'text', label: 'Título' },
                { name: 'desc', type: 'textarea', label: 'Descripción' },
                { name: 'cta', type: 'text', label: 'CTA (texto)' },
                { name: 'href', type: 'text', label: 'URL' },
              ],
            },
          ],
        },
        // --- blog ------------------------------------------------------------
        {
          name: 'blog',
          type: 'group',
          label: 'Blog',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [
                { name: 'type', type: 'text', label: 'Tipo' },
                { name: 'title', type: 'text', label: 'Título' },
                { name: 'desc', type: 'textarea', label: 'Descripción' },
                { name: 'href', type: 'text', label: 'URL' },
              ],
            },
          ],
        },
        // --- faq -------------------------------------------------------------
        {
          name: 'faq',
          type: 'group',
          label: 'FAQ',
          fields: [
            { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
            { name: 'title', type: 'text', label: 'Título' },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              fields: [
                { name: 'q', type: 'text', label: 'Pregunta' },
                { name: 'a', type: 'textarea', label: 'Respuesta' },
                { name: 'open', type: 'checkbox', label: 'Abierta por defecto' },
              ],
            },
          ],
        },
        // --- footer ----------------------------------------------------------
        {
          name: 'footer',
          type: 'group',
          label: 'Footer',
          fields: [
            { name: 'brandText', type: 'textarea', label: 'Texto de marca' },
            {
              name: 'columns',
              type: 'array',
              label: 'Columnas',
              fields: [
                { name: 'title', type: 'text', label: 'Título' },
                { name: 'links', type: 'array', label: 'Links', fields: linkFields },
              ],
            },
            {
              name: 'brands',
              type: 'array',
              label: 'Marcas',
              fields: [{ name: 'value', type: 'text', label: 'Marca' }],
            },
            { name: 'copyright', type: 'text', label: 'Copyright' },
            { name: 'waLabel', type: 'text', label: 'WhatsApp — label' },
            { name: 'waHref', type: 'text', label: 'WhatsApp — URL' },
          ],
        },
      ],
    },
  ],
}
