'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Get listed', body: 'Add your place to the directory. We manually review every submission before it goes live.' },
      { icon: Phone, title: 'Partnership questions', body: 'Talk through bulk publishing, local coverage, and neighborhood collaborations.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category shelf? Tell us where the gap is.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Submit a paper', body: 'Pitch a report, whitepaper, or guide worth filing in the Reference Library.' },
      { icon: Mail, title: 'Editorial partnerships', body: 'Coordinate collaborations, cross-posts, and reference releases.' },
      { icon: Sparkles, title: 'Contributor questions', body: 'Get help with formatting, voice, and the review workflow.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss image essays, creator features, and gallery launches.' },
      { icon: Sparkles, title: 'Licensing &amp; usage', body: 'Reach out about usage rights, commercial requests, and partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request our media pack, editor decks, or feature placement details.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Suggest a resource', body: 'Send a link, tool, or reference worth keeping on the saved shelf.' },
    { icon: Mail, title: 'Curation partnerships', body: 'Coordinate reading lists, reference pages, and link programs.' },
    { icon: Sparkles, title: 'Editor questions', body: 'Need help organizing collections or getting a resource surfaced?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)
  const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden bg-[var(--slot4-accent-fill)] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(86,72,228,0.9),rgba(4,4,4,0.35))]" />
          <div className={`relative ${container} pb-20 pt-24 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40`}>
            <EditableReveal className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
              {pagesContent.contact.eyebrow}
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-uppercase mt-8 max-w-4xl text-balance text-[2.5rem] font-bold leading-[0.95] sm:text-[4rem] lg:text-[5.5rem]">
                {pagesContent.contact.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">{pagesContent.contact.description}</p>
            </EditableReveal>
          </div>
        </section>

        <section className={`${container} py-20 sm:py-24 lg:py-28`}>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="border-t border-[var(--editable-border)]">
              {lanes.map((lane, i) => (
                <EditableReveal key={lane.title} index={i}>
                  <div className="flex items-start gap-6 border-b border-[var(--editable-border)] py-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-fill)]">
                      <lane.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="editable-display text-xl font-semibold text-[var(--slot4-page-text)]">{lane.title}</h2>
                      <p className="mt-2 text-[15px] leading-7 text-[var(--slot4-muted-text)]" dangerouslySetInnerHTML={{ __html: lane.body }} />
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>

            <EditableReveal>
              <div className="border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
                <h2 className="editable-uppercase text-[2rem] font-semibold leading-[1] sm:text-[2.5rem]">{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
