import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Long-form field notes, essays, and guides.',
    description:
      'Slower reads from the editorial desk — essays, guides, and explainers that give the two shelves their context.',
    filterLabel: 'Filter topic',
    secondaryNote: 'A place to think out loud about how the index gets edited.',
    chips: ['Editorial', 'Essays', 'Slow reads'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Time-sensitive notices and open offers.',
    description:
      'Practical, act-on-it entries — offers, opportunities, and short-lived notices posted by community members.',
    filterLabel: 'Filter notice type',
    secondaryNote: 'Short summaries, direct actions, minimal editorial noise.',
    chips: ['Notices', 'Offers', 'Time-sensitive'],
  },
  sbm: {
    eyebrow: 'Saved shelf',
    headline: 'Links, tools, and resources kept for later.',
    description:
      'A small shelf of external resources we return to often — reference tools, reading lists, and reliable sources.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Every link is checked before it lands on the shelf.',
    chips: ['Curated', 'Tools', 'Reference'],
  },
  profile: {
    eyebrow: 'People index',
    headline: 'The people, studios, and businesses behind the index.',
    description:
      'A short list of makers, operators, and studios worth knowing about — the humans behind the entries in the directory.',
    filterLabel: 'Filter profile type',
    secondaryNote: 'Identity, trust, and context before the list.',
    chips: ['People', 'Studios', 'Independent'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Reference papers, reports, and guides worth keeping.',
    description:
      'A growing archive of downloadable reference material — reports, whitepapers, guides, and manuals worth saving to your own reference folder.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Read before it is filed. Downloadable and freely browsable.',
    chips: ['Archive', 'Downloadable', 'Reference'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'A hand-picked directory of independent places worth visiting.',
    description:
      'Independent operators, studios, and neighborhood addresses — reviewed by a real person, no ranking, no paid placement.',
    filterLabel: 'Filter category',
    secondaryNote: 'Every entry is manually checked before it lands on the shelf.',
    chips: ['Directory', 'Independent', 'Hand-checked'],
  },
  image: {
    eyebrow: 'Image stories',
    headline: 'Image-led stories and small photo essays.',
    description:
      'Occasional visual pieces that don’t fit neatly on either shelf — small photo essays, gallery notes, and image stories.',
    filterLabel: 'Filter visual type',
    secondaryNote: 'Let the images carry the page before the copy does.',
    chips: ['Visual', 'Essays', 'Gallery'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
