import type { CSSProperties } from 'react'

/*
  Design contract — orvn-inspired.

  Violet #5648e4 primary, lime #befb7c accent, near-black #040404 ink on
  white #ffffff page. Space Grotesk display / Manrope body. Pill CTAs
  (100px radius). Container 1280px. Section rhythm 60/120px.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#040404',
  '--slot4-panel-bg': '#f1f3f5',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#666666',
  '--slot4-soft-muted-text': '#999999',
  '--slot4-accent': '#5648e4',
  '--slot4-accent-fill': '#5648e4',
  '--slot4-accent-soft': '#eeecfb',
  '--slot4-accent-secondary': '#befb7c',
  '--slot4-accent-secondary-soft': '#f0fddc',
  '--slot4-blush': '#fcf0f0',
  '--slot4-on-accent': '#ffffff',
  '--slot4-on-accent-secondary': '#040404',
  '--slot4-dark-bg': '#0b0b0b',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#f1f3f5',
  '--slot4-cream': '#ffffff',
  '--slot4-warm': '#fafafa',
  '--slot4-lavender': '#eeecfb',
  '--slot4-gray': '#f1f3f5',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#040404',
  '--editable-container': '1280px',
  '--editable-container-narrow': '1044px',
  '--editable-border': '#e6e6e6',
  '--editable-border-strong': '#040404',
  '--editable-nav-bg': '#ffffff',
  '--editable-nav-text': '#040404',
  '--editable-nav-active': '#5648e4',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#5648e4',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#0b0b0b',
  '--editable-footer-text': '#ffffff',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-secondary)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_6px_28px_-12px_rgba(4,4,4,0.14)]',
  shadowStrong: 'shadow-[0_18px_60px_-18px_rgba(4,4,4,0.28)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(4,4,4,0.05),rgba(4,4,4,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10',
    sectionY: 'py-16 sm:py-20 lg:py-[7.5rem]',
    sectionYSm: 'py-10 sm:py-14 lg:py-16',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    editorialGrid: 'grid gap-8 md:grid-cols-2',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'editable-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent)]',
    kicker: 'editable-mono text-[11px] font-semibold uppercase tracking-[0.28em]',
    heroTitle:
      'editable-uppercase text-[2.75rem] font-bold leading-[0.95] sm:text-[4.5rem] lg:text-[6.5rem]',
    sectionTitle:
      'editable-uppercase text-[2rem] font-semibold leading-[0.98] sm:text-[3rem] lg:text-[4.25rem]',
    subhead:
      'editable-display text-[1.5rem] font-medium leading-tight tracking-[-0.01em] sm:text-[1.75rem]',
    body: 'text-base leading-[1.6]',
    emphasis: 'editable-display text-lg italic leading-snug sm:text-xl',
  },
  surface: {
    card: `border-0 ${editablePalette.surfaceBg}`,
    soft: `border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
    accent: 'bg-[var(--slot4-blush)]',
    lift: `border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-on-accent)] transition duration-200 hover:brightness-110 active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] transition duration-200 hover:bg-[var(--slot4-page-text)] hover:text-white active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] transition duration-200 hover:brightness-105 active:scale-[0.98]',
    ghost:
      'inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition duration-200 hover:bg-white hover:text-[var(--slot4-page-text)] active:scale-[0.98]',
    onDark:
      'inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] transition duration-200 hover:bg-[var(--slot4-accent-secondary)] active:scale-[0.98]',
  },
  badge: {
    pill:
      'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-page-text)]',
    accentPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)]',
    darkPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white',
  },
  media: {
    frame: 'relative overflow-hidden bg-[var(--slot4-media-bg)]',
    frameFull: 'relative w-full overflow-hidden bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[4/3]',
    editorial: 'aspect-[16/10]',
    wide: 'aspect-[21/9]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1',
    fade: 'transition duration-300 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
    arrow: 'transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5',
  },
} as const

export const aiLayoutRules = [
  'Change palette in editableRootStyle first; every downstream section reads --slot4-* CSS variables.',
  'Buttons are pill (rounded-full). Never introduce sharp or soft-corner buttons.',
  'Use uppercase display type for hero and section headings; keep body sentence case.',
  'Cards are borderless with a light shadow; images fill first, copy sits below.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
