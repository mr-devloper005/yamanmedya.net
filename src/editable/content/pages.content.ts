import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A hand-picked directory and reference library',
      description:
        'Browse a hand-picked local directory and a curated reference library — manually reviewed entries, no algorithmic ranking.',
      openGraphTitle: 'A quieter index of the good stuff',
      openGraphDescription:
        'A local directory of independent operators and a reference library of downloadable papers, kept simple.',
      keywords: [
        'local directory',
        'reference library',
        'curated index',
        'independent operators',
        'reference archive',
        'neighborhood guide',
      ],
    },
    hero: {
      badge: 'Directory · Reference Library',
      title: ['Places to visit &', 'papers to read.'],
      description:
        'Two clean shelves. One for hand-picked local places worth your time; one for reference papers worth keeping. No algorithm, no ranking — just careful editing.',
      primaryCta: { label: 'Browse the Local Directory', href: '/listings' },
      secondaryCta: { label: 'Open the Reference Library', href: '/pdf' },
      searchPlaceholder: 'Search places, papers, categories…',
      focusLabel: 'Currently indexing',
      featureCardBadge: 'latest additions',
      featureCardTitle: 'Fresh entries land here first.',
      featureCardDescription:
        'The latest places checked and the most recent reference papers filed, in one running list.',
    },
    intro: {
      badge: 'How the index works',
      title: 'Two shelves, one careful index.',
      paragraphs: [
        'The Local Directory is a hand-checked list of independent operators, studios, and neighborhood addresses worth knowing about.',
        'The Reference Library is a growing archive of downloadable papers — reports, guides, and references we think are worth saving.',
        'Nothing here is auto-ingested and nothing is sponsored. Every entry is manually reviewed before it goes live.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Local Directory: independent places, checked by hand.',
        'Reference Library: reports and guides worth saving.',
        'No algorithmic ranking, no paid placement.',
        'Every entry reviewed by a real editor.',
      ],
      primaryLink: { label: 'Open the Local Directory', href: '/listings' },
      secondaryLink: { label: 'Open the Reference Library', href: '/pdf' },
    },
    cta: {
      badge: 'Start browsing',
      title: 'Two shelves worth your attention.',
      description:
        'The Local Directory for places to visit; the Reference Library for papers worth keeping. Open either shelf and browse.',
      primaryCta: { label: 'Open the Local Directory', href: '/listings' },
      secondaryCta: { label: 'Contact editorial', href: '/contact' },
    },
    taskSection: {
      heading: 'Just added to {label}',
      descriptionSuffix: 'The latest entries on this shelf.',
    },
  },
  about: {
    badge: 'The story',
    title: 'A quieter index.',
    description: `${slot4BrandConfig.siteName} keeps two shelves: a Local Directory of independent operators and a Reference Library of papers worth keeping. Both are manually reviewed.`,
    paragraphs: [
      'We built this because we were tired of algorithmic indexes that promote the loudest and bury the interesting. Everything you see here was added by a person who thought it was worth adding.',
      'Places on the Local Directory are visited or verified. Papers in the Reference Library are read before they are filed. No auto-ingest. No paid placement. No ranking games.',
      'The index will always be smaller than a database. That is the point.',
    ],
    values: [
      {
        title: 'Small is fine',
        description:
          'We would rather have 100 entries worth reading than 10,000 you have to sort through. Every addition passes editorial review.',
      },
      {
        title: 'Two shelves only',
        description:
          'The Local Directory for places; the Reference Library for papers. We are not adding more shelves — the constraint is what makes the index useful.',
      },
      {
        title: 'No paid placement',
        description:
          'Nothing is sponsored, boosted, or promoted. If we ever add a partnership, it will be clearly marked and kept out of the main index.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach the editor directly.',
    description:
      'Whether you want to add a place, suggest a paper, report an outdated entry, or just say hello — this goes straight to the person who edits the index.',
    formTitle: 'Send a note',
  },

  search: {
    metadata: {
      title: 'Search the index',
      description: 'Search every entry across the Local Directory and the Reference Library.',
    },
    hero: {
      badge: 'Search the index',
      title: 'Find a place or a paper, fast.',
      description:
        'Search every entry across both shelves. Filter by category or shelf, or leave the field empty to browse the latest additions.',
      placeholder: 'Search places, papers, categories…',
    },
    resultsTitle: 'Latest across both shelves',
  },
  create: {
    metadata: {
      title: 'Submit an entry',
      description: 'Submit a place for the Local Directory or a paper for the Reference Library.',
    },
    locked: {
      badge: 'Editor access',
      title: 'Sign in to submit an entry.',
      description:
        'You need an account to send a submission through to the editor. Everything is reviewed by hand before it goes live.',
    },
    hero: {
      badge: 'Submit an entry',
      title: 'Send us a place or a paper.',
      description:
        'Pick the shelf, share the details, and we will review the entry by hand. Nothing is auto-published; every submission is manually checked.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Send submission',
    successTitle: 'Submission received — thanks.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your editor account.',
      badge: 'Editor access',
      title: 'Welcome back.',
      description:
        'Sign in to continue browsing, tracking your submissions, and sending new entries through to the editor.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched. Create one first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an editor account.',
      badge: 'New account',
      title: 'Set up your editor account.',
      description:
        'An account lets you send entries through to the editor and track them. It takes about fifteen seconds and asks nothing you have not already given every other site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More field notes',
      fallbackTitle: 'Field note',
    },
    listing: {
      relatedTitle: 'More in the Local Directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More image stories',
      fallbackTitle: 'Image story',
    },
    profile: {
      relatedTitle: 'More profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
