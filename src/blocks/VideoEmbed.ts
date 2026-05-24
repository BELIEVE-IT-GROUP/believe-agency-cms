import type { Block } from 'payload'

export const VideoEmbedBlock: Block = {
  slug: 'video-embed',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    { name: 'headline', type: 'text', label: 'Título (opcional)' },
    { name: 'subheadline', type: 'textarea', label: 'Subtítulo (opcional)' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'URL directa (mp4)', value: 'direct' },
      ],
    },
    { name: 'videoId', type: 'text', label: 'ID del video (YouTube/Vimeo) o URL directa' },
    { name: 'poster', type: 'upload', relationTo: 'media', label: 'Thumbnail / poster' },
    { name: 'autoplay', type: 'checkbox', defaultValue: false, label: 'Autoplay (muted)' },
    { name: 'fullWidth', type: 'checkbox', defaultValue: true, label: 'Full width' },
  ],
}
