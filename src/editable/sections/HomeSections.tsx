'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight, Search, Plus, Minus } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskDisplayLabel } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ============================================================
   HERO — sticky violet block, word-stacked uppercase headline
   ============================================================ */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const countTotal = pool.length
  const heroImage =
    pool.map((p) => getEditablePostImage(p)).find((src) => src && !src.includes('placeholder')) ||
    '/placeholder.svg?height=1200&width=1800'

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-accent-fill)] text-white">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(86,72,228,0.6)_0%,rgba(4,4,4,0.35)_100%)]" />

      <div className={`relative ${container} pb-24 pt-28 sm:pb-32 sm:pt-36 lg:pb-40 lg:pt-44`}>
        <EditableReveal index={0} className="flex items-center gap-4">
          <span className="editable-mono rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] backdrop-blur">
            {SITE_CONFIG.name}
          </span>
          <span className="editable-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
            Directory · Reference Library
          </span>
        </EditableReveal>

        <EditableReveal index={1} className="mt-10 max-w-[18ch]">
          <h1 className="editable-uppercase text-[3rem] font-bold leading-[0.9] text-white sm:text-[5rem] lg:text-[7.5rem]">
            <span className="block">Places to</span>
            <span className="block">visit &amp;</span>
            <span className="block text-[var(--slot4-accent-secondary)]">papers to read.</span>
          </h1>
        </EditableReveal>

        <EditableReveal index={2} className="mt-10 max-w-2xl">
          <p className="text-base leading-8 text-white/85 sm:text-lg">
            {SITE_CONFIG.name} is a two-shelf project: a hand-picked local directory of independent
            operators, and a reference library of downloadable papers worth keeping. Everything
            in one place, no algorithm.
          </p>
        </EditableReveal>

        <EditableReveal index={3} className="mt-12 flex flex-wrap items-center gap-4">
          <Link href={primaryRoute} className={dc.button.accent}>
            Browse {taskDisplayLabel(primaryTask).toLowerCase()} <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/search" className={dc.button.ghost}>
            Search the archive
          </Link>
        </EditableReveal>

        {/* Search bar sits inside the hero */}
        <EditableReveal index={4} className="mt-16 max-w-xl">
          <form
            action="/search"
            className="flex items-stretch overflow-hidden rounded-full border border-white/20 bg-white/95 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]"
          >
            <label className="flex flex-1 items-center gap-3 px-5">
              <Search className="h-4 w-4 shrink-0 text-[var(--slot4-page-text)]" />
              <input
                name="q"
                type="search"
                placeholder="Search places, papers, categories…"
                className="w-full bg-transparent py-3.5 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
              />
            </label>
            <button className="editable-mono shrink-0 bg-[var(--slot4-page-text)] px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[var(--slot4-accent-secondary)] hover:text-[var(--slot4-page-text)]">
              Search
            </button>
          </form>
        </EditableReveal>

        {countTotal ? (
          <EditableReveal index={5} className="editable-mono absolute bottom-6 right-5 hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70 sm:right-8 lg:block lg:right-10">
            {countTotal} entries indexed
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

/* ============================================================
   MARQUEE band — small kicker + huge single-word H2 in lime
   ============================================================ */
export function EditableStoryRail({ primaryTask, primaryRoute }: HomeSectionProps) {
  const label = taskDisplayLabel(primaryTask).toLowerCase()
  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-text)] text-white">
      <div className={`${container} py-20 sm:py-28 lg:py-36`}>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-end">
          <EditableReveal index={0}>
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
              What lives here
            </p>
            <p className="mt-6 max-w-md text-lg leading-8 text-white/70">
              Two clean shelves. On one, hand-picked places worth your time in the neighborhood.
              On the other, papers worth reading — reports, guides, references you can save.
            </p>
            <Link
              href={primaryRoute}
              className="editable-mono mt-8 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:text-[var(--slot4-accent-secondary)]"
            >
              Start with {label} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </EditableReveal>

          <EditableReveal index={1}>
            <h2 className="editable-uppercase text-[3.5rem] font-semibold leading-[0.92] text-white sm:text-[6rem] lg:text-[8rem]">
              <span className="block">A quieter</span>
              <span className="block text-[var(--slot4-accent-secondary)]">index</span>
              <span className="block">of the good stuff.</span>
            </h2>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   FEATURE CARDS — numbered rows on white
   ============================================================ */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!activity.length) return null

  return (
    <section className="bg-white">
      <div className={`${container} py-20 sm:py-28 lg:py-32`}>
        <EditableReveal className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <div>
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
              Recent additions
            </p>
            <h2 className="editable-uppercase mt-6 text-[2.25rem] font-semibold leading-[0.98] text-[var(--slot4-page-text)] sm:text-[3.5rem] lg:text-[4.5rem]">
              Just in <br />
              <span className="text-[var(--slot4-accent-fill)]">the index.</span>
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">
            The newest entries across the directory and the reference library — checked, tagged, and
            ready to browse. Every entry is manually reviewed; every paper is manually filed.
          </p>
        </EditableReveal>

        <div className="mt-16 border-b border-[var(--editable-border)]">
          {activity.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i} step={70}>
              <Link
                href={postHref(primaryTask, post, primaryRoute)}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-t border-[var(--editable-border)] py-8 transition hover:pl-4 sm:gap-10 sm:py-10"
              >
                <span className="editable-mono w-12 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">
                    {categoryOf(post) || taskDisplayLabel(primaryTask)}
                  </p>
                  <h3 className="editable-uppercase mt-2 line-clamp-2 text-[1.5rem] font-semibold leading-[1] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent-fill)] sm:text-[2rem] lg:text-[2.75rem]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-1 text-sm text-[var(--slot4-muted-text)] sm:line-clamp-2">
                    {getExcerpt(post, 160)}
                  </p>
                </div>
                <ArrowUpRight className="h-6 w-6 shrink-0 text-[var(--slot4-muted-text)] transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--slot4-accent-fill)]" />
              </Link>
            </EditableReveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href={primaryRoute} className={dc.button.secondary}>
            See every entry <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   STATS BAND — dark section with lime highlight
   ============================================================ */
function StatsBand({ posts, timeSections }: { posts: SitePost[]; timeSections: HomeTimeSection[] }) {
  const total = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).length
  const categories = new Set<string>()
  ;[...posts, ...timeSections.flatMap((s) => s.posts)].forEach((p) => {
    const c = categoryOf(p)
    if (c) categories.add(c)
  })
  const stats = [
    { value: total || 24, label: 'entries in the index' },
    { value: categories.size || 8, label: 'active categories' },
    { value: SITE_CONFIG.tasks.filter((t) => t.enabled).length, label: 'shelves you can browse' },
    { value: '100%', label: 'hand-checked, no algorithm' },
  ]
  return (
    <section className="bg-[var(--slot4-page-text)] text-white">
      <div className={`${container} py-20 sm:py-28`}>
        <EditableReveal>
          <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
            What we keep
          </p>
          <h2 className="editable-uppercase mt-6 max-w-3xl text-[2rem] font-semibold leading-[0.95] sm:text-[3rem] lg:text-[4.25rem]">
            Small numbers. <br />
            <span className="text-[var(--slot4-accent-secondary)]">Real signal.</span>
          </h2>
        </EditableReveal>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <EditableReveal key={s.label} index={i}>
              <div className="border-t border-white/15 pt-6">
                <p className="editable-uppercase text-[3rem] font-bold leading-none text-[var(--slot4-accent-secondary)] sm:text-[4rem]">
                  {s.value}
                </p>
                <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">{s.label}</p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   EDITORIAL GRID — 2-col blog cards
   ============================================================ */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 4), href: primaryRoute },
          { key: 'browse', posts: posts.slice(4, 8), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return <StatsBand posts={posts} timeSections={timeSections} />

  const editorialPool = dedupePosts(visible.flatMap((s) => s.posts)).slice(0, 6)

  return (
    <>
      <StatsBand posts={posts} timeSections={timeSections} />

      <section className="bg-[var(--slot4-blush)]">
        <div className={`${container} py-20 sm:py-28 lg:py-32`}>
          <EditableReveal className="mx-auto max-w-3xl text-center">
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
              Reader picks
            </p>
            <h2 className="editable-uppercase mt-6 text-[2rem] font-semibold leading-[0.98] text-[var(--slot4-page-text)] sm:text-[3rem] lg:text-[4.25rem]">
              What we&apos;ve been reading &amp; visiting.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">
              A rolling shortlist from the community — places worth the trip and papers worth the
              scroll. Updated by hand, never by trend.
            </p>
          </EditableReveal>

          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:gap-14">
            {editorialPool.map((post, i) => (
              <EditableReveal key={post.id || post.slug} index={i} step={100}>
                <EditorialTile post={post} href={postHref(primaryTask, post, primaryRoute)} />
              </EditableReveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href={primaryRoute} className={dc.button.primary}>
              Explore the archive <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  )
}

function EditorialTile({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post) || 'Field notes'
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img
          src={image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <span className="editable-mono absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
          {category}
        </span>
      </div>
      <div className="pt-6">
        <h3 className="editable-uppercase text-[1.5rem] font-semibold leading-[1.05] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent-fill)] sm:text-[2rem]">
          {post.title}
        </h3>
        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">
          {getExcerpt(post, 180)}
        </p>
        <span className="editable-mono mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
          Open <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  )
}

/* ============================================================
   FAQ — thin rule dividers, plus/minus toggle
   ============================================================ */
const FAQ_ITEMS = [
  {
    q: 'How do you pick what goes in the directory?',
    a: 'By hand. We visit, read, and check every entry. There is no ranking algorithm and no paid placement.',
  },
  {
    q: 'What kinds of papers live in the reference library?',
    a: 'Reports, guides, whitepapers, and reference PDFs worth keeping. Each one is filed with pages, size, and a short synopsis.',
  },
  {
    q: 'Can I submit a place or a paper?',
    a: 'Yes — hit Submit in the top-right (you will need an account). We review every submission before it goes live.',
  },
  {
    q: 'Is anything on the site paid or sponsored?',
    a: 'No. If we ever add a partnership, it will be marked clearly and never mixed into the main index.',
  },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="bg-white">
      <div className={`${container} py-20 sm:py-28 lg:py-32`}>
        <EditableReveal className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div>
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
              Common questions
            </p>
            <h2 className="editable-uppercase mt-6 text-[2rem] font-semibold leading-[0.98] text-[var(--slot4-page-text)] sm:text-[3rem] lg:text-[4rem]">
              Answers, <br />
              <span className="text-[var(--slot4-accent-fill)]">before you ask.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-7 text-[var(--slot4-muted-text)]">
              Everything about how the site is edited, who runs it, and how to submit an entry.
            </p>
          </div>
          <div className="border-t border-[var(--editable-border)]">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i
              return (
                <div key={item.q} className="border-b border-[var(--editable-border)]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="editable-display text-lg font-semibold text-[var(--slot4-page-text)] sm:text-xl">
                      {item.q}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)]">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={`grid overflow-hidden transition-all duration-500 ease-[var(--ease-premium)] ${
                      isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0">
                      <p className="max-w-2xl text-[15px] leading-7 text-[var(--slot4-muted-text)]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ============================================================
   CTA closer — huge uppercase invitation
   ============================================================ */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-text)] text-white">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal>
          <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
            Ready to add?
          </p>
          <h2 className="editable-uppercase mt-8 max-w-5xl text-[2.75rem] font-bold leading-[0.9] sm:text-[5rem] lg:text-[8rem]">
            Send us <br />
            <span className="text-[var(--slot4-accent-secondary)]">what we</span> <br />
            missed.
          </h2>
        </EditableReveal>
        <EditableReveal index={1} className="mt-14 flex flex-wrap gap-4">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-9 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] transition hover:brightness-105"
          >
            Submit an entry <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-9 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white hover:text-[var(--slot4-page-text)]"
          >
            Say hello <ChevronRight className="h-4 w-4" />
          </Link>
        </EditableReveal>
      </div>
    </section>
  )
}
