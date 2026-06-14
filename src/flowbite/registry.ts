export type FlowbiteBlockType =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'cta'
  | 'faq'
  | 'stats'
  | 'team'
  | 'logo-cloud'
  | 'gallery'
  | 'contact'
  | 'split-content'
  | 'video-embed'
  | 'newsletter'
  | 'blog-list'
  | 'header'
  | 'footer'

export type FlowbiteTemplate = {
  id: string
  blockType: FlowbiteBlockType
  label: string
  sourceFile: string
  notes?: string
}

export const flowbiteTemplates = [
  // Hero sections
  { id: 'hero.default', blockType: 'hero', label: 'Default hero section', sourceFile: 'marketing-ui/hero-sections/default.tsx' },
  { id: 'hero.visual-image-heading', blockType: 'hero', label: 'Visual image with heading', sourceFile: 'marketing-ui/hero-sections/video-image-heading.tsx' },
  { id: 'hero.search-datepicker', blockType: 'hero', label: 'Search bar with datepicker', sourceFile: 'marketing-ui/hero-sections/datepicker.tsx' },
  { id: 'hero.email-signup-video', blockType: 'hero', label: 'Email sign-up with video', sourceFile: 'marketing-ui/hero-sections/email-signup-video.tsx' },
  { id: 'hero.illustration-email-signup', blockType: 'hero', label: 'Illustration with email sign-up', sourceFile: 'marketing-ui/hero-sections/illustration.tsx' },
  { id: 'hero.cover-image-ctas', blockType: 'hero', label: 'Cover image with CTAs', sourceFile: 'marketing-ui/hero-sections/image-cover.tsx' },
  { id: 'hero.screenshot-download', blockType: 'hero', label: 'Informational CTA with app screenshot', sourceFile: 'marketing-ui/hero-sections/cta-screenshot-download.tsx' },
  { id: 'hero.search-bar', blockType: 'hero', label: 'Hero with search bar', sourceFile: 'marketing-ui/hero-sections/search-bar.tsx' },
  { id: 'hero.video-embed-cta', blockType: 'hero', label: 'Video embed with CTA', sourceFile: 'marketing-ui/hero-sections/video-embed-cta.tsx' },
  { id: 'hero.signup-cta', blockType: 'hero', label: 'Sign-up form with CTA', sourceFile: 'marketing-ui/hero-sections/signup-cta.tsx' },
  { id: 'hero.app-preview-ctas', blockType: 'hero', label: 'App screenshot with CTAs', sourceFile: 'marketing-ui/hero-sections/cta-app-preview.tsx' },
  { id: 'hero.background-cover-ctas', blockType: 'hero', label: 'Background image with CTAs', sourceFile: 'marketing-ui/hero-sections/cta-background-cover.tsx' },
  { id: 'hero.crypto', blockType: 'hero', label: 'Financial exchange hero', sourceFile: 'marketing-ui/hero-sections/crypto.tsx' },
  { id: 'hero.background-image-cards', blockType: 'hero', label: 'Background image cards', sourceFile: 'marketing-ui/hero-sections/grid-cards.tsx' },
  { id: 'hero.carousel', blockType: 'hero', label: 'Carousel slider hero', sourceFile: 'marketing-ui/hero-sections/carousel.tsx' },
  { id: 'hero.book-cover', blockType: 'hero', label: 'Book cover hero', sourceFile: 'marketing-ui/hero-sections/book-cover.tsx' },
  { id: 'hero.blog-posts-featured', blockType: 'hero', label: 'Blog posts with featured image', sourceFile: 'marketing-ui/hero-sections/blog-posts.tsx' },
  { id: 'hero.phone-mockup-download', blockType: 'hero', label: 'Phone mockup with app download', sourceFile: 'marketing-ui/hero-sections/phone-mockup.tsx' },
  { id: 'hero.storefront-default', blockType: 'hero', label: 'Storefront hero default', sourceFile: 'ecommerce-ui/storefront-hero-sections/default.tsx' },
  { id: 'hero.storefront-background-image', blockType: 'hero', label: 'Storefront background image', sourceFile: 'ecommerce-ui/storefront-hero-sections/background-image.tsx' },
  { id: 'hero.storefront-full-slider', blockType: 'hero', label: 'Storefront full slider', sourceFile: 'ecommerce-ui/storefront-hero-sections/full-slider.tsx' },
  { id: 'hero.storefront-grid-view', blockType: 'hero', label: 'Storefront grid view', sourceFile: 'ecommerce-ui/storefront-hero-sections/grid-view.tsx' },

  // Feature sections
  { id: 'features.default', blockType: 'features', label: 'Default feature list', sourceFile: 'marketing-ui/feature-sections/default.tsx' },
  { id: 'features.image-list', blockType: 'features', label: 'Image with feature list and CTAs', sourceFile: 'marketing-ui/feature-sections/image-list.tsx' },
  { id: 'features.cta-list', blockType: 'features', label: 'Feature list with CTAs', sourceFile: 'marketing-ui/feature-sections/cta-list.tsx' },
  { id: 'features.icons-list', blockType: 'features', label: 'Feature list with icons', sourceFile: 'marketing-ui/feature-sections/icons-list.tsx' },
  { id: 'features.icon-list-cta', blockType: 'features', label: 'Feature icons and CTA', sourceFile: 'marketing-ui/feature-sections/icon-list-cta.tsx' },
  { id: 'features.description-icon-list', blockType: 'features', label: 'Description with feature list icons', sourceFile: 'marketing-ui/feature-sections/description-icon-list.tsx' },
  { id: 'features.card-list', blockType: 'features', label: 'Feature list cards', sourceFile: 'marketing-ui/feature-sections/card-list.tsx' },
  { id: 'features.alternate', blockType: 'features', label: 'Alternate image with feature list', sourceFile: 'marketing-ui/feature-sections/alternate.tsx' },
  { id: 'features.comparison', blockType: 'features', label: 'Comparison cards', sourceFile: 'marketing-ui/feature-sections/comparison.tsx' },
  { id: 'features.rounded-icons', blockType: 'features', label: 'Rounded icons feature section', sourceFile: 'marketing-ui/feature-sections/rounded-icons.tsx' },

  // Pricing tables
  { id: 'pricing.default', blockType: 'pricing', label: 'Default pricing cards', sourceFile: 'marketing-ui/pricing-tables/default.tsx' },
  { id: 'pricing.tabs-selector', blockType: 'pricing', label: 'Tabs selector pricing cards', sourceFile: 'marketing-ui/pricing-tables/tabs-selector.tsx' },
  { id: 'pricing.horizontal', blockType: 'pricing', label: 'Horizontal pricing card', sourceFile: 'marketing-ui/pricing-tables/horizontal.tsx' },
  { id: 'pricing.feature-list', blockType: 'pricing', label: 'Feature list pricing card', sourceFile: 'marketing-ui/pricing-tables/feature-list.tsx' },
  { id: 'pricing.comparison-table', blockType: 'pricing', label: 'Comparison table', sourceFile: 'marketing-ui/pricing-tables/comparison-table.tsx' },
  { id: 'pricing.highlighted-plan', blockType: 'pricing', label: 'Highlighted pricing plan', sourceFile: 'marketing-ui/pricing-tables/highlighted-plan.tsx' },
  { id: 'pricing.toggle', blockType: 'pricing', label: 'Pricing plan with toggle switch', sourceFile: 'marketing-ui/pricing-tables/pricing-toggle.tsx' },

  // Testimonials
  { id: 'testimonials.blockquote', blockType: 'testimonials', label: 'Blockquote testimonial', sourceFile: 'marketing-ui/testimonials/blockquote.tsx' },
  { id: 'testimonials.carousel-slider', blockType: 'testimonials', label: 'Carousel slider testimonials', sourceFile: 'marketing-ui/testimonials/carousel-slider.tsx' },
  { id: 'testimonials.grid-layout-cards', blockType: 'testimonials', label: 'Grid layout testimonial cards', sourceFile: 'marketing-ui/testimonials/grid-layout-cards.tsx' },
  { id: 'testimonials.cards', blockType: 'testimonials', label: 'Testimonial cards', sourceFile: 'marketing-ui/testimonials/testimonial-cards.tsx' },
  { id: 'testimonials.tabs', blockType: 'testimonials', label: 'Testimonial tabs', sourceFile: 'marketing-ui/testimonials/testimonial-tabs.tsx' },

  // CTA and banners
  { id: 'cta.default', blockType: 'cta', label: 'Default CTA section', sourceFile: 'marketing-ui/cta-sections/default.tsx' },
  { id: 'cta.cards-icons', blockType: 'cta', label: 'Card CTAs with icons', sourceFile: 'marketing-ui/cta-sections/cards-icons.tsx' },
  { id: 'cta.email-signup', blockType: 'cta', label: 'Email sign-up CTA', sourceFile: 'marketing-ui/cta-sections/email-signup.tsx' },
  { id: 'cta.finance-trading', blockType: 'cta', label: 'Financial trading CTA', sourceFile: 'marketing-ui/cta-sections/finance-trading.tsx' },
  { id: 'cta.heading-button', blockType: 'cta', label: 'Heading with CTA button', sourceFile: 'marketing-ui/cta-sections/heading-cta.tsx' },
  { id: 'cta.image-button', blockType: 'cta', label: 'Image with CTA button', sourceFile: 'marketing-ui/cta-sections/image-cta-button.tsx' },
  { id: 'cta.mobile-app', blockType: 'cta', label: 'Mobile app download CTA', sourceFile: 'marketing-ui/cta-sections/mobile-app.tsx' },
  { id: 'cta.qr-code', blockType: 'cta', label: 'QR code CTA', sourceFile: 'marketing-ui/cta-sections/qr-code.tsx' },
  { id: 'cta.tabs-mobile-app', blockType: 'cta', label: 'Tabs and mobile app CTA', sourceFile: 'marketing-ui/cta-sections/tabs.tsx' },
  { id: 'cta.two-cards', blockType: 'cta', label: 'Two cards and images CTA', sourceFile: 'marketing-ui/cta-sections/two-cards.tsx' },
  { id: 'cta.banner-default', blockType: 'cta', label: 'Default banner', sourceFile: 'marketing-ui/banners/default.tsx' },
  { id: 'cta.banner-announcement', blockType: 'cta', label: 'Announcement banner', sourceFile: 'marketing-ui/banners/announcement.tsx' },
  { id: 'cta.banner-launch', blockType: 'cta', label: 'Launch banner', sourceFile: 'marketing-ui/banners/launch.tsx' },

  // FAQ
  { id: 'faq.accordion', blockType: 'faq', label: 'FAQ accordion', sourceFile: 'marketing-ui/faq-sections/accordion.tsx' },
  { id: 'faq.default', blockType: 'faq', label: 'Default FAQ section', sourceFile: 'marketing-ui/faq-sections/default.tsx' },
  { id: 'faq.grid-layout', blockType: 'faq', label: 'FAQ three columns', sourceFile: 'marketing-ui/faq-sections/grid-layout.tsx' },
  { id: 'faq.help-center', blockType: 'faq', label: 'Help center FAQ', sourceFile: 'marketing-ui/faq-sections/help-center.tsx' },
  { id: 'faq.help-center-search', blockType: 'faq', label: 'Help center search FAQ', sourceFile: 'marketing-ui/faq-sections/help-center-search.tsx' },
  { id: 'faq.customer-service', blockType: 'faq', label: 'Customer service FAQ', sourceFile: 'ecommerce-ui/customer-service/accordion-faq.tsx' },

  // Stats / social proof
  { id: 'stats.default', blockType: 'stats', label: 'Default social proof', sourceFile: 'marketing-ui/social-proof/default.tsx' },
  { id: 'stats.card-statistics', blockType: 'stats', label: 'Cards with statistics', sourceFile: 'marketing-ui/social-proof/card-statistics.tsx' },
  { id: 'stats.carousel-slider', blockType: 'stats', label: 'Carousel slider social proof', sourceFile: 'marketing-ui/social-proof/carousel-slider.tsx' },
  { id: 'stats.heading-statistics', blockType: 'stats', label: 'Heading with statistics', sourceFile: 'marketing-ui/social-proof/heading-statistics.tsx' },
  { id: 'stats.icon-statistics', blockType: 'stats', label: 'Statistics with icons and CTA', sourceFile: 'marketing-ui/social-proof/icon-statistics.tsx' },
  { id: 'stats.illustration', blockType: 'stats', label: 'Illustration with statistics', sourceFile: 'marketing-ui/social-proof/illustration.tsx' },
  { id: 'stats.content-social-proof', blockType: 'stats', label: 'Content section social proof', sourceFile: 'marketing-ui/content-sections/social-proof.tsx' },

  // Team
  { id: 'team.default', blockType: 'team', label: 'Team member cards', sourceFile: 'marketing-ui/team-sections/default.tsx' },
  { id: 'team.carousel-slider', blockType: 'team', label: 'Team carousel slider', sourceFile: 'marketing-ui/team-sections/carousel-slider.tsx' },
  { id: 'team.cta-grid', blockType: 'team', label: 'Cards with grid layout and CTA', sourceFile: 'marketing-ui/team-sections/cta.tsx' },
  { id: 'team.description', blockType: 'team', label: 'Description with team members', sourceFile: 'marketing-ui/team-sections/description.tsx' },
  { id: 'team.four-columns', blockType: 'team', label: 'Four column team grid', sourceFile: 'marketing-ui/team-sections/four-columns.tsx' },
  { id: 'team.grid-cards', blockType: 'team', label: 'Grid layout cards', sourceFile: 'marketing-ui/team-sections/grid-cards.tsx' },
  { id: 'team.grid-clean', blockType: 'team', label: 'Grid layout clean', sourceFile: 'marketing-ui/team-sections/grid-clean.tsx' },
  { id: 'team.overlay-zoom', blockType: 'team', label: 'Overlay cards with zoom effect', sourceFile: 'marketing-ui/team-sections/overlay-zoom.tsx' },

  // Logo cloud
  { id: 'logo-cloud.default', blockType: 'logo-cloud', label: 'Default customer logos', sourceFile: 'marketing-ui/customer-logos/default.tsx' },
  { id: 'logo-cloud.4-columns', blockType: 'logo-cloud', label: 'Clients logo grid 4 columns', sourceFile: 'marketing-ui/customer-logos/4-columns.tsx' },
  { id: 'logo-cloud.cards-cta', blockType: 'logo-cloud', label: 'Cards with CTA customer logos', sourceFile: 'marketing-ui/customer-logos/cards-with-cta.tsx' },
  { id: 'logo-cloud.cards-description', blockType: 'logo-cloud', label: 'Cards with description customer logos', sourceFile: 'marketing-ui/customer-logos/cards-with-description.tsx' },
  { id: 'logo-cloud.heading-grid', blockType: 'logo-cloud', label: 'Heading grid layout customer logos', sourceFile: 'marketing-ui/customer-logos/heading-grid-layout.tsx' },

  // Gallery / portfolio
  { id: 'gallery.image-gallery', blockType: 'gallery', label: 'Image gallery content section', sourceFile: 'marketing-ui/content-sections/image-gallery.tsx' },
  { id: 'gallery.portfolio-default', blockType: 'gallery', label: 'Default project portfolio', sourceFile: 'marketing-ui/project-portfolio/default.tsx' },
  { id: 'gallery.portfolio-alternate', blockType: 'gallery', label: 'Project portfolio alternate sections', sourceFile: 'marketing-ui/project-portfolio/alternate-sections.tsx' },
  { id: 'gallery.portfolio-carousel', blockType: 'gallery', label: 'Project portfolio carousel', sourceFile: 'marketing-ui/project-portfolio/carousel.tsx' },
  { id: 'gallery.portfolio-featured-image', blockType: 'gallery', label: 'Project portfolio featured image', sourceFile: 'marketing-ui/project-portfolio/featured-image.tsx' },
  { id: 'gallery.portfolio-grid-layout', blockType: 'gallery', label: 'Grid layout image CTA preview portfolio', sourceFile: 'marketing-ui/project-portfolio/grid-layout.tsx' },

  // Contact
  { id: 'contact.default', blockType: 'contact', label: 'Default contact form', sourceFile: 'marketing-ui/contact-forms/default.tsx' },
  { id: 'contact.address-location', blockType: 'contact', label: 'Contact with address location', sourceFile: 'marketing-ui/contact-forms/address-location.tsx' },
  { id: 'contact.background-image', blockType: 'contact', label: 'Contact with background image', sourceFile: 'marketing-ui/contact-forms/background-image.tsx' },
  { id: 'contact.company-information', blockType: 'contact', label: 'Contact with company information', sourceFile: 'marketing-ui/contact-forms/company-information.tsx' },
  { id: 'contact.help-center', blockType: 'contact', label: 'Contact with help center', sourceFile: 'marketing-ui/contact-forms/help-center.tsx' },
  { id: 'contact.links', blockType: 'contact', label: 'Contact with links', sourceFile: 'marketing-ui/contact-forms/links.tsx' },

  // Split content / content sections
  { id: 'split-content.two-columns', blockType: 'split-content', label: 'Heading with description two columns', sourceFile: 'marketing-ui/content-sections/two-columns.tsx' },
  { id: 'split-content.heading-description', blockType: 'split-content', label: 'Heading with description', sourceFile: 'marketing-ui/content-sections/heading-description.tsx' },
  { id: 'split-content.heading-images', blockType: 'split-content', label: 'Images with heading and description', sourceFile: 'marketing-ui/content-sections/heading-images.tsx' },
  { id: 'split-content.feature-list', blockType: 'split-content', label: 'Logo CTA links image feature list', sourceFile: 'marketing-ui/content-sections/feature-list.tsx' },
  { id: 'split-content.card-images', blockType: 'split-content', label: 'Content card images', sourceFile: 'marketing-ui/content-sections/card-images.tsx' },
  { id: 'split-content.table-contents', blockType: 'split-content', label: 'Table of contents card', sourceFile: 'marketing-ui/content-sections/table-contents.tsx' },

  // Video
  { id: 'video-embed.content-video', blockType: 'video-embed', label: 'Video embed content section', sourceFile: 'marketing-ui/content-sections/video-embed.tsx' },
  { id: 'video-embed.hero-video-cta', blockType: 'video-embed', label: 'Hero video embed with CTA', sourceFile: 'marketing-ui/hero-sections/video-embed-cta.tsx' },
  { id: 'video-embed.hero-email-video', blockType: 'video-embed', label: 'Hero email signup with video', sourceFile: 'marketing-ui/hero-sections/email-signup-video.tsx' },

  // Newsletter
  { id: 'newsletter.default', blockType: 'newsletter', label: 'Default newsletter section', sourceFile: 'marketing-ui/newsletter-sections/default.tsx' },
  { id: 'newsletter.banner', blockType: 'newsletter', label: 'Banner email sign-up', sourceFile: 'marketing-ui/newsletter-sections/banner.tsx' },
  { id: 'newsletter.email-signup-card', blockType: 'newsletter', label: 'Email sign-up card', sourceFile: 'marketing-ui/newsletter-sections/email-signup-card.tsx' },
  { id: 'newsletter.modal-signup', blockType: 'newsletter', label: 'Modal email sign-up', sourceFile: 'marketing-ui/newsletter-sections/modal-signup.tsx' },
  { id: 'newsletter.popup-email', blockType: 'newsletter', label: 'Popup email sign-up', sourceFile: 'marketing-ui/newsletter-sections/popup-email.tsx' },

  // Blog sections
  { id: 'blog-list.default', blockType: 'blog-list', label: 'Default blog section', sourceFile: 'marketing-ui/blog-sections/default.tsx' },
  { id: 'blog-list.card-with-image', blockType: 'blog-list', label: 'Card with image blog section', sourceFile: 'marketing-ui/blog-sections/card-with-image.tsx' },
  { id: 'blog-list.centered-posts', blockType: 'blog-list', label: 'Centered posts blog section', sourceFile: 'marketing-ui/blog-sections/centered-posts.tsx' },
  { id: 'blog-list.featured-post', blockType: 'blog-list', label: 'Featured post blog section', sourceFile: 'marketing-ui/blog-sections/featured-post.tsx' },
  { id: 'blog-list.list-with-heading', blockType: 'blog-list', label: 'List with heading blog section', sourceFile: 'marketing-ui/blog-sections/list-with-heading.tsx' },
  { id: 'blog-list.publisher-related-default', blockType: 'blog-list', label: 'Related articles default', sourceFile: 'publisher-ui/related-articles/default.tsx' },
  { id: 'blog-list.publisher-related-grid', blockType: 'blog-list', label: 'Related articles grid cards', sourceFile: 'publisher-ui/related-articles/grid-layout-cards.tsx' },
  { id: 'blog-list.publisher-related-carousel', blockType: 'blog-list', label: 'Related articles carousel cards', sourceFile: 'publisher-ui/related-articles/carousel-slider-cards.tsx' },
  { id: 'blog-list.publisher-related-horizontal', blockType: 'blog-list', label: 'Related articles horizontal card image', sourceFile: 'publisher-ui/related-articles/horizontal-card-image.tsx' },

  // Layout templates for future Settings collection
  { id: 'header.default', blockType: 'header', label: 'Default header navigation', sourceFile: 'marketing-ui/headers/default.tsx' },
  { id: 'header.centered', blockType: 'header', label: 'Header with centered logo', sourceFile: 'marketing-ui/headers/centered.tsx' },
  { id: 'header.dropdown', blockType: 'header', label: 'Header with dropdown menu', sourceFile: 'marketing-ui/headers/dropdown.tsx' },
  { id: 'header.mega-dropdown', blockType: 'header', label: 'Mega dropdown header', sourceFile: 'marketing-ui/headers/mega-dropdown.tsx' },
  { id: 'header.mega-menu', blockType: 'header', label: 'Mega menu header', sourceFile: 'marketing-ui/headers/mega-menu.tsx' },
  { id: 'header.search', blockType: 'header', label: 'Header with search bar', sourceFile: 'marketing-ui/headers/search.tsx' },
  { id: 'header.sub-navbar', blockType: 'header', label: 'Header with sub-navbar', sourceFile: 'marketing-ui/headers/sub-navbar.tsx' },
  { id: 'header.user-dropdown', blockType: 'header', label: 'Header with user dropdown', sourceFile: 'marketing-ui/headers/user-dropdown.tsx' },
  { id: 'footer.default', blockType: 'footer', label: 'Default footer section', sourceFile: 'marketing-ui/footer-sections/default.tsx' },
  { id: 'footer.flowbite-footer', blockType: 'footer', label: 'Flowbite footer section', sourceFile: 'marketing-ui/footer-sections/flowbite-footer.tsx' },
  { id: 'footer.newsletter', blockType: 'footer', label: 'Newsletter sign-up footer', sourceFile: 'marketing-ui/footer-sections/newsletter-footer.tsx' },
  { id: 'footer.pre-footer-cta', blockType: 'footer', label: 'Pre-footer CTA section', sourceFile: 'marketing-ui/footer-sections/pre-footer.tsx' },
  { id: 'footer.sitemap-links', blockType: 'footer', label: 'Sitemap links footer', sourceFile: 'marketing-ui/footer-sections/sitemap-links.tsx' },
  { id: 'footer.sitemap-logo', blockType: 'footer', label: 'Sitemap logo footer', sourceFile: 'marketing-ui/footer-sections/sitemap-logo.tsx' },
  { id: 'footer.social-media', blockType: 'footer', label: 'Social media icons footer', sourceFile: 'marketing-ui/footer-sections/social-media.tsx' },
] as const satisfies readonly FlowbiteTemplate[]

export function getFlowbiteTemplates(blockType: FlowbiteBlockType) {
  return flowbiteTemplates.filter((template) => template.blockType === blockType)
}

export function getDefaultFlowbiteTemplateId(blockType: FlowbiteBlockType) {
  return getFlowbiteTemplates(blockType)[0]?.id
}

export function getFlowbiteTemplateOptions(blockType: FlowbiteBlockType) {
  return getFlowbiteTemplates(blockType).map((template) => ({
    label: template.label,
    value: template.id,
  }))
}

export {
  flowbiteCatalog,
  getCmsMappedFlowbiteCatalogEntries,
  getFlowbiteCatalogEntries,
  getFlowbiteCatalogGroups,
  getUnmappedFlowbiteCatalogEntries,
  type FlowbiteCatalogEntry,
} from './catalog.ts'
