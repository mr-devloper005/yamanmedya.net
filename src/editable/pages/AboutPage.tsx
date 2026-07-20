import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[var(--slot4-accent-fill)] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(86,72,228,0.9),rgba(4,4,4,0.35))]" />
          <div className={`relative ${container} pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-40`}>
            <EditableReveal className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
              {pagesContent.about.badge}
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-uppercase mt-8 max-w-4xl text-balance text-[2.75rem] font-bold leading-[0.95] sm:text-[5rem] lg:text-[6.5rem]">
                About <br /><span className="text-[var(--slot4-accent-secondary)]">{SITE_CONFIG.name}.</span>
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-10 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">{pagesContent.about.description}</p>
            </EditableReveal>
          </div>
        </section>

        {/* Manifesto — big paragraphs on white */}
        <section className={`${container} py-20 sm:py-24 lg:py-28`}>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr]">
            <EditableReveal>
              <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
                How we work
              </p>
              <h2 className="editable-uppercase mt-6 text-[2rem] font-semibold leading-[1] text-[var(--slot4-page-text)] sm:text-[3rem] lg:text-[4rem]">
                One index, <br />
                <span className="text-[var(--slot4-accent-fill)]">two shelves.</span>
              </h2>
            </EditableReveal>
            <EditableReveal index={1} className="space-y-6 text-[1.0625rem] leading-8 text-[var(--slot4-page-text)]">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </EditableReveal>
          </div>
        </section>

        {/* Values grid — bordered rows */}
        <section className="bg-[var(--slot4-blush)]">
          <div className={`${container} py-20 sm:py-24 lg:py-28`}>
            <EditableReveal>
              <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
                What we hold to
              </p>
              <h2 className="editable-uppercase mt-6 text-[2rem] font-semibold leading-[1] text-[var(--slot4-page-text)] sm:text-[3rem]">
                Editorial principles.
              </h2>
            </EditableReveal>
            <div className="mt-14 border-t border-[var(--editable-border)]">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="grid gap-6 border-b border-[var(--editable-border)] py-10 sm:grid-cols-[120px_1fr] sm:gap-10">
                    <span className="editable-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="editable-display text-xl font-semibold text-[var(--slot4-page-text)] sm:text-2xl">{value.title}</h3>
                      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>
            <div className="mt-14 flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110">
                Say hello <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-white">
                Back to index
              </Link>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
