import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline,
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: slot4BrandConfig.tagline || 'Local Directory · Reference Library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Submit', href: '/create' },
    },
  },
  footer: {
    tagline: 'Two shelves. Real signal.',
    description:
      'A hand-picked local directory paired with a reference library of downloadable papers. Manually reviewed, quietly maintained, never algorithm-ranked.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listings' },
          { label: 'Reference Library', href: '/pdf' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Made with care · Directory · Reference Library',
  },
  commonLabels: {
    readMore: 'Open',
    viewAll: 'View all',
    explore: 'Browse',
    latest: 'Just added',
    related: 'More from this shelf',
    published: 'Filed',
  },
} as const
