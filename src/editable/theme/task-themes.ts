import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surfaces — one shared visual language (violet / lime / near-black).
  Only kicker + note vary per task. The `kicker` string is also the user-facing
  display label for that task (never render the raw task key).
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Space Grotesk', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const BODY = "'Manrope', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#ffffff',
  surface: '#ffffff',
  raised: '#f1f3f5',
  text: '#040404',
  muted: '#666666',
  line: '#e6e6e6',
  accent: '#5648e4',
  accentSoft: '#eeecfb',
  onAccent: '#ffffff',
  glow: 'rgba(86,72,228,0.10)',
  radius: '0px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Field notes',
    note: 'Essays, guides, and long-reads worth a proper sit-down.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Discover independent operators, studios, and neighborhood addresses.',
  },
  classified: {
    ...base,
    kicker: 'Notice board',
    note: 'Time-sensitive offers, opportunities, and things to act on now.',
  },
  image: {
    ...base,
    kicker: 'Visual desk',
    note: 'A gallery-first read of standout images and photo essays.',
  },
  sbm: {
    ...base,
    kicker: 'Saved shelf',
    note: 'Curated links, references, and resources kept for later.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Downloadable guides, whitepapers, and reference papers.',
  },
  profile: {
    ...base,
    kicker: 'People index',
    note: 'The makers, businesses, and studios behind the directory.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

/** User-facing display label for a task (masks the underlying task.label). */
export function taskDisplayLabel(task: TaskKey): string {
  return getTaskTheme(task).kicker
}

/** Short user-facing description for a task (masks task.description). */
export const taskDisplayDescription: Record<TaskKey, string> = {
  article: 'Long-form field notes and guides.',
  listing: 'Independent places, hand-checked.',
  classified: 'Short-lived notices and offers.',
  image: 'Small photo essays and image stories.',
  sbm: 'Saved links and reference tools.',
  pdf: 'Downloadable reference papers.',
  profile: 'People and studios behind the index.',
}

export function taskDisplayInfo(task: TaskKey): string {
  return taskDisplayDescription[task] || getTaskTheme(task).note
}
