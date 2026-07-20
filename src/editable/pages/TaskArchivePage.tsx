import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, Globe, MapPin, Phone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle, taskDisplayLabel } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;|&apos;/gi, "'")
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 md:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase = 'group block bg-white transition duration-500 hover:-translate-y-1'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const label = taskDisplayLabel(task)
  const page = pagination.page || 1
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* HERO — bold violet block for the shelf */}
        <header className="relative overflow-hidden bg-[var(--slot4-accent-fill)] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(86,72,228,0.9),rgba(4,4,4,0.4))]" />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32 lg:px-10 lg:pb-32 lg:pt-40">
            <EditableReveal className="editable-mono flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
              <span>{label}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-white/70">Curated shelf</span>
            </EditableReveal>
            <EditableReveal index={1} className="mt-8 max-w-[16ch]">
              <h1 className="editable-uppercase text-[2.75rem] font-bold leading-[0.95] sm:text-[4.5rem] lg:text-[6rem]">
                {label}.
              </h1>
            </EditableReveal>
            <EditableReveal index={2} className="mt-8 max-w-2xl">
              <p className="text-base leading-8 text-white/85 sm:text-lg">{voice?.description || theme.note}</p>
            </EditableReveal>
            {voice?.chips?.length ? (
              <EditableReveal index={3} className="mt-8 flex flex-wrap gap-2">
                {voice.chips.map((chip) => (
                  <span key={chip} className="editable-mono rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                    {chip}
                  </span>
                ))}
              </EditableReveal>
            ) : null}

            <EditableReveal index={4} className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="editable-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-white/80">
                <span className="text-[var(--slot4-accent-secondary)]">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
              </p>
              <form action={basePath} className="flex items-center gap-2">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 appearance-none rounded-full border border-white/25 bg-white/10 pl-4 pr-10 text-sm font-medium text-white outline-none transition backdrop-blur focus:border-[var(--slot4-accent-secondary)]"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all" className="text-[var(--slot4-page-text)]">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug} className="text-[var(--slot4-page-text)]">{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                </div>
                <button className="editable-mono inline-flex h-11 items-center rounded-full bg-[var(--slot4-accent-secondary)] px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-page-text)] transition hover:brightness-105">
                  Apply
                </button>
              </form>
            </EditableReveal>
          </div>
        </header>

        {/* PDF shelf shows one header ad here */}
        {task === 'pdf' ? (
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10 pt-10">
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
          </div>
        ) : null}

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10 py-20 sm:py-24">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.flatMap((post, index) => {
                const card = <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />
                if (task === 'listing' && index === 2) {
                  return [
                    card,
                    <div key="archive-ad" className="md:col-span-2">
                      <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel className="mx-auto w-full" />
                    </div>,
                  ]
                }
                return [card]
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-uppercase mt-6 text-2xl font-semibold">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--tk-muted)]">
                Try another category, or check back after new {label.toLowerCase()} entries land.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="editable-mono rounded-full border border-[var(--tk-line)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:border-[var(--tk-text)] hover:bg-[var(--tk-text)] hover:text-white">
                  Previous
                </Link>
              ) : null}
              <span className="editable-mono rounded-full bg-[var(--tk-text)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="editable-mono rounded-full border border-[var(--tk-line)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:border-[var(--tk-text)] hover:bg-[var(--tk-text)] hover:text-white">
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="editable-mono mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-text)]">
      {label}
      <ArrowUpRight className={`h-3.5 w-3.5 ${dc.motion.arrow}`} />
    </span>
  )
}

/* -------- article -------- */
function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <EditableReveal index={index % 6} step={70}>
      <Link href={href} className={`${cardBase} flex flex-col`}>
        <div className="relative aspect-[16/11] overflow-hidden bg-[var(--tk-raised)]">
          <img src={image} alt="" className={`h-full w-full object-cover ${dc.motion.zoom}`} />
        </div>
        <div className="pt-6">
          <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">
            {category} · No. {String(index + 1).padStart(2, '0')}
          </p>
          <h2 className="editable-uppercase mt-3 text-[1.75rem] font-semibold leading-[1.02] text-[var(--tk-text)]">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
          <CardArrow label="Read article" />
        </div>
      </Link>
    </EditableReveal>
  )
}

/* -------- listing (Local Directory) — premium row card -------- */
function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Directory')
  return (
    <EditableReveal index={index % 6} step={70}>
      <Link href={href} className={`${cardBase} flex gap-6 border border-[var(--tk-line)] p-6 hover:border-[var(--tk-text)] sm:p-7`}>
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-raised)]">
          {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">{category}</p>
          <h2 className="editable-display mt-2 truncate text-xl font-semibold leading-tight text-[var(--tk-text)]">{post.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[var(--tk-muted)]">
            {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
            {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
            {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span> : null}
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" />
      </Link>
    </EditableReveal>
  )
}

/* -------- classified -------- */
function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col border border-[var(--tk-line)] p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-uppercase text-[2.25rem] font-semibold leading-none text-[var(--tk-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className="editable-mono rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-accent)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-6 text-xl font-semibold leading-snug text-[var(--tk-text)]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="editable-mono mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">{location ? <><MapPin className="h-3.5 w-3.5" /> {location}</> : 'Details inside'}</span>
        <ArrowUpRight className={`h-4 w-4 text-[var(--tk-accent)] ${dc.motion.arrow}`} />
      </div>
    </Link>
  )
}

/* -------- image -------- */
function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-6 block break-inside-avoid overflow-hidden bg-[var(--tk-surface)]">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className={`h-full w-full object-cover ${dc.motion.zoom}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(4,4,4,0.75))] opacity-90 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="editable-uppercase line-clamp-2 text-lg font-semibold leading-tight text-white sm:text-xl">{post.title}</h2>
          <span className="editable-mono mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Open <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

/* -------- sbm -------- */
function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-5 border border-[var(--tk-line)] p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Saved · {String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-2 text-lg font-semibold leading-snug text-[var(--tk-text)]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="editable-mono mt-3 truncate text-[11px] font-semibold text-[var(--tk-accent)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

/* -------- pdf (Reference Library) — document tile -------- */
function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getCategory(post, 'Reference')
  const fileSize = getField(post, ['fileSize', 'size'])
  const pageCount = getField(post, ['pages', 'pageCount'])
  return (
    <EditableReveal index={index % 6} step={60}>
      <Link href={href} className={`${cardBase} flex h-full flex-col border border-[var(--tk-line)] p-7 hover:border-[var(--tk-text)]`}>
        <div className="flex items-start justify-between gap-4">
          <div className="editable-uppercase flex h-16 w-14 flex-col items-center justify-center bg-[var(--tk-text)] text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
            <span>REF</span>
          </div>
          <span className="editable-mono rounded-full border border-[var(--tk-line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            {category}
          </span>
        </div>
        <h2 className="editable-display mt-8 text-xl font-semibold leading-snug text-[var(--tk-text)]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="editable-mono mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          <span>{pageCount ? `${pageCount} pages` : 'Reference'}{fileSize ? ` · ${fileSize}` : ''}</span>
          <span className="inline-flex items-center gap-1.5 text-[var(--tk-accent)]">
            Open <Download className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

/* -------- profile -------- */
function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center border border-[var(--tk-line)] p-8 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-6 text-lg font-semibold text-[var(--tk-text)]">{post.title}</h2>
      {role ? <p className="editable-mono mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
