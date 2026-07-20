import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Camera, CheckCircle2, Download,
  ExternalLink, FileText, Globe2, Mail, MapPin, Phone, ShieldCheck, UserRound,
  Layers, Sparkles,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle, taskDisplayLabel } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  // For paper detail: if the payload didn't ship a file size, HEAD the file URL
  // to discover the real Content-Length. Merged onto post.content so the
  // existing resolveFileSize helper picks it up without new props.
  if (task === 'pdf' && !resolveFileSize(post)) {
    const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
    if (fileUrl) {
      const discovered = await fetchRemoteFileSize(fileUrl)
      if (discovered) {
        post.content = { ...(post.content && typeof post.content === 'object' ? post.content : {}), fileSize: discovered }
      }
    }
  }
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

// Human-readable size from bytes.
const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`
  const gb = mb / 1024
  return `${gb < 10 ? gb.toFixed(1) : Math.round(gb)} GB`
}

// HEAD the file URL to read Content-Length. Falls back to '' on any error.
// Cached daily via Next's fetch cache so we don't re-probe on every render.
const fetchRemoteFileSize = async (url: string): Promise<string> => {
  if (!url || !/^https?:\/\//i.test(url)) return ''
  try {
    const res = await fetch(url, { method: 'HEAD', next: { revalidate: 86400 } })
    if (!res.ok) return ''
    const len = res.headers.get('content-length')
    const bytes = len ? Number(len) : 0
    return formatBytes(bytes)
  } catch {
    return ''
  }
}

// Resolve the file size from wherever it might live on the post payload.
// Accepts pre-formatted strings ("2.4 MB") OR raw byte counts (number/string).
const resolveFileSize = (post: SitePost): string => {
  const content = getContent(post)
  const stringKeys = ['fileSize', 'size', 'fileSizeLabel', 'formattedFileSize']
  for (const key of stringKeys) {
    const value = asText(content[key])
    if (value && /[a-z]/i.test(value)) return value
  }
  const numericSources: unknown[] = [
    content.fileSizeBytes,
    content.sizeBytes,
    content.bytes,
    content.fileSize,
    content.size,
    Array.isArray(post.media) && post.media[0] ? (post.media[0] as { size?: unknown }).size : undefined,
    Array.isArray(post.media) && post.media[0] ? (post.media[0] as { fileSize?: unknown }).fileSize : undefined,
    Array.isArray(post.media) && post.media[0] ? (post.media[0] as { bytes?: unknown }).bytes : undefined,
  ]
  for (const raw of numericSources) {
    if (raw == null) continue
    const num = typeof raw === 'number' ? raw : Number(raw)
    if (Number.isFinite(num) && num > 0) return formatBytes(num)
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

export function TaskDetailView({
  task, post, related, comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------- shared bits ------------- */
function Kicker({ task, children }: { task: TaskKey; children?: React.ReactNode }) {
  const label = taskDisplayLabel(task)
  return (
    <div className="editable-mono flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">
      <span>{label}</span>
      {children ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
          <span className="text-[var(--tk-muted)]">{children}</span>
        </>
      ) : null}
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const label = taskDisplayLabel(task)
  return (
    <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {label}
    </Link>
  )
}

function Divider() {
  return <div className="my-12 h-px bg-[var(--tk-line)]" />
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ post }: { post: SitePost }) {
  const tags = Array.isArray(post.tags) ? post.tags.filter((t): t is string => typeof t === 'string' && !!t) : []
  if (!tags.length) return null
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {tags.slice(0, 8).map((tag) => (
        <span key={tag} className="editable-mono rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
          #{tag}
        </span>
      ))}
    </div>
  )
}

/* ======================= ARTICLE (unchanged shape, restyled) ======================= */
function ArticleDetail({
  post, related, comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-20 sm:px-6 sm:py-24">
        <BackLink task="article" />
        <p className="editable-mono mt-12 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">
          {categoryOf(post, 'Field notes')}
        </p>
        <h1 className="editable-uppercase mt-6 text-balance text-[2.5rem] font-bold leading-[0.98] sm:text-[4rem] lg:text-[5rem]">
          {post.title}
        </h1>
        <div className="mt-6 text-sm text-[var(--tk-muted)]">
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? (
          <img src={images[0]} alt="" className="mt-12 aspect-[16/10] w-full border border-[var(--tk-line)] object-cover" />
        ) : null}
        <BodyContent post={post} />
        <TagChips post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ======================= LISTING — premium directory record ======================= */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openHours', 'schedule'])
  const category = categoryOf(post, taskDisplayLabel('listing'))
  const mapSrc = mapSrcFor(post)

  const trust = [
    { icon: ShieldCheck, label: 'Manually verified entry' },
    { icon: CheckCircle2, label: 'Reviewed by an editor' },
    { icon: Sparkles, label: 'Independent recommendation' },
  ]

  return (
    <>
      {/* HERO ribbon */}
      <section className="relative overflow-hidden bg-[var(--tk-text)] text-white">
        {hero ? (
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.4)_0%,rgba(4,4,4,0.9)_100%)]" />
        <div className={`relative ${container} pb-20 pt-24 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40`}>
          <BackLink task="listing" />
          <EditableReveal index={0} className="mt-10">
            <div className="editable-mono flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
              <span>{taskDisplayLabel('listing')}</span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="text-white/70">{category}</span>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-uppercase mt-6 max-w-4xl text-balance text-[2.5rem] font-bold leading-[0.95] text-white sm:text-[4rem] lg:text-[5.5rem]">
              {post.title}
            </h1>
          </EditableReveal>
          {leadText(post) ? (
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80">{leadText(post)}</p>
            </EditableReveal>
          ) : null}
        </div>
      </section>

      {/* Hero image band — 21:9 for that reference feel */}
      {hero ? (
        <div className={`${container} -mt-10 pb-8`}>
          <EditableReveal>
            <div className="relative w-full overflow-hidden bg-[var(--tk-raised)] aspect-[21/9]">
              <img src={hero} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </EditableReveal>
        </div>
      ) : null}

      {/* Quick facts strip */}
      <section className={`${container} pt-10`}>
        <EditableReveal>
          <div className="grid gap-0 border-t border-[var(--tk-line)] sm:grid-cols-2 lg:grid-cols-4 lg:border-b">
            {[
              { label: 'Location', value: address || 'Address on request', Icon: MapPin },
              { label: 'Phone', value: phone || 'Contact via the site', Icon: Phone },
              { label: 'Hours', value: hours || 'By appointment', Icon: Layers },
              { label: 'Status', value: 'Verified entry', Icon: ShieldCheck },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-4 border-b border-[var(--tk-line)] py-6 pr-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                  <row.Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">{row.label}</p>
                  <p className="mt-1 truncate text-sm font-medium text-[var(--tk-text)]">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </EditableReveal>
      </section>

      {/* Body + sticky sidebar */}
      <section className={`${container} py-16 sm:py-20 lg:py-24`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <article className="min-w-0">
            <EditableReveal>
              <h2 className="editable-uppercase text-[2rem] font-semibold leading-[1] text-[var(--tk-text)] sm:text-[2.75rem]">
                About this place
              </h2>
            </EditableReveal>
            <BodyContent post={post} />
            <TagChips post={post} />
            {images.length > 1 ? (
              <>
                <Divider />
                <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                  Gallery
                </p>
                <h3 className="editable-uppercase mt-4 text-[1.5rem] font-semibold text-[var(--tk-text)] sm:text-[2rem]">
                  Scenes from the space.
                </h3>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {images.slice(1, 7).map((image, i) => (
                    <EditableReveal key={`${image}-${i}`} index={i} step={80}>
                      <div className="relative w-full overflow-hidden bg-[var(--tk-raised)] aspect-[4/3]">
                        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.03]" />
                      </div>
                    </EditableReveal>
                  ))}
                </div>
              </>
            ) : null}
            {mapSrc ? (
              <>
                <Divider />
                <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                  On the map
                </p>
                <h3 className="editable-uppercase mt-4 text-[1.5rem] font-semibold text-[var(--tk-text)] sm:text-[2rem]">
                  How to find it.
                </h3>
                <div className="mt-6 overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                  <iframe src={mapSrc} title="Map" loading="lazy" className="h-[420px] w-full border-0" />
                </div>
              </>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal>
              <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="border-b border-[var(--tk-line)] bg-[var(--tk-text)] p-6 text-white">
                  <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent-secondary)]">
                    Contact card
                  </p>
                  <h3 className="editable-display mt-2 text-xl font-semibold">{post.title}</h3>
                </div>
                <ul className="divide-y divide-[var(--tk-line)]">
                  {address ? (
                    <li>
                      <a href={mapSrc ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '#'} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-5 transition hover:bg-[var(--tk-raised)]">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                        <span className="min-w-0 flex-1"><span className="editable-mono block text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Address</span><span className="mt-1 block break-words text-sm font-medium">{address}</span></span>
                      </a>
                    </li>
                  ) : null}
                  {phone ? (
                    <li>
                      <a href={`tel:${phone}`} className="flex items-start gap-3 p-5 transition hover:bg-[var(--tk-raised)]">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                        <span className="min-w-0 flex-1"><span className="editable-mono block text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Phone</span><span className="mt-1 block break-words text-sm font-medium">{phone}</span></span>
                      </a>
                    </li>
                  ) : null}
                  {email ? (
                    <li>
                      <a href={`mailto:${email}`} className="flex items-start gap-3 p-5 transition hover:bg-[var(--tk-raised)]">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                        <span className="min-w-0 flex-1"><span className="editable-mono block text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Email</span><span className="mt-1 block break-words text-sm font-medium">{email}</span></span>
                      </a>
                    </li>
                  ) : null}
                  {website ? (
                    <li>
                      <a href={website} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-5 transition hover:bg-[var(--tk-raised)]">
                        <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                        <span className="min-w-0 flex-1"><span className="editable-mono block text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Website</span><span className="mt-1 block break-words text-sm font-medium">Visit</span></span>
                      </a>
                    </li>
                  ) : null}
                  {hours ? (
                    <li className="flex items-start gap-3 p-5">
                      <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                      <span className="min-w-0 flex-1"><span className="editable-mono block text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Hours</span><span className="mt-1 block break-words text-sm font-medium">{hours}</span></span>
                    </li>
                  ) : null}
                </ul>
                <div className="border-t border-[var(--tk-line)] p-5">
                  <a
                    href={website || (phone ? `tel:${phone}` : email ? `mailto:${email}` : '#')}
                    target={website ? '_blank' : undefined}
                    rel={website ? 'noreferrer' : undefined}
                    className="editable-mono inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:brightness-110"
                  >
                    {website ? 'Visit website' : phone ? 'Call now' : email ? 'Send an email' : 'Contact'} <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">Why we trust it</p>
                <ul className="mt-4 grid gap-3 text-sm text-[var(--tk-text)]">
                  {trust.map((t) => (
                    <li key={t.label} className="flex items-center gap-3">
                      <t.icon className="h-4 w-4 text-[var(--tk-accent)]" />
                      <span>{t.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
            </EditableReveal>
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

/* ======================= PDF — document workspace, no imagery ======================= */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const fileSize = resolveFileSize(post)
  const format = getField(post, ['format']) || 'PAPER'
  const uploader = getField(post, ['author', 'uploader', 'publisher']) || SITE_CONFIG.name
  const category = categoryOf(post, taskDisplayLabel('pdf'))
  const insideList = (() => {
    const src = getField(post, ['tableOfContents', 'toc', 'contents'])
    if (src) {
      return src.split(/\n|;|,/).map((s) => s.trim()).filter(Boolean).slice(0, 6)
    }
    return [
      'Executive summary',
      'Key findings',
      'Method &amp; scope',
      'Appendix &amp; references',
    ]
  })()

  return (
    <>
      {/* HERO: label chips + huge H1 + pull-quote lead */}
      <section className={`${container} pb-14 pt-20 sm:pb-16 sm:pt-24`}>
        <BackLink task="pdf" />
        <EditableReveal index={0} className="mt-12 flex flex-wrap items-center gap-2">
          <span className="editable-mono rounded-full bg-[var(--tk-text)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
            {taskDisplayLabel('pdf')}
          </span>
          <span className="editable-mono rounded-full bg-[var(--slot4-accent-secondary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-text)]">
            {format}
          </span>
          <span className="editable-mono rounded-full border border-[var(--tk-line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
            {category}
          </span>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className="editable-uppercase mt-8 max-w-5xl text-balance text-[2.75rem] font-bold leading-[0.92] text-[var(--tk-text)] sm:text-[5rem] lg:text-[7rem]">
            {post.title}
          </h1>
        </EditableReveal>
        {leadText(post) ? (
          <EditableReveal index={2}>
            <blockquote className="mt-12 max-w-3xl border-l-4 border-[var(--tk-accent)] pl-8">
              <p className="editable-display text-[1.5rem] font-medium leading-[1.35] text-[var(--tk-text)] sm:text-[1.875rem]">
                &ldquo;{leadText(post)}&rdquo;
              </p>
            </blockquote>
          </EditableReveal>
        ) : null}
        <EditableReveal index={3} className="mt-10 flex flex-wrap gap-4">
          {fileUrl ? (
            <a href={fileUrl} download className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110">
              Download paper <Download className="h-4 w-4" />
            </a>
          ) : null}
          {fileUrl ? (
            <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-text)] bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-white">
              Open in new tab <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </EditableReveal>
      </section>

      {/* Quick-facts strip */}
      <section className={`${container} pb-12`}>
        <EditableReveal>
          <div className="grid gap-0 border-y border-[var(--tk-line)] sm:grid-cols-3">
            {[
              { label: 'File size', value: fileSize || '—' },
              { label: 'Format', value: format },
              { label: 'Filed under', value: category },
            ].map((row, i) => (
              <div key={row.label} className={`py-6 pl-6 pr-6 ${i > 0 ? 'sm:border-l sm:border-[var(--tk-line)]' : ''} ${i > 0 ? 'sm:border-t-0 border-t border-[var(--tk-line)]' : ''}`}>
                <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">{row.label}</p>
                <p className="editable-uppercase mt-2 text-[1.5rem] font-semibold leading-none text-[var(--tk-text)]">{row.value}</p>
              </div>
            ))}
          </div>
        </EditableReveal>
      </section>

      {/* Preview iframe — the document IS the hero visual */}
      {fileUrl ? (
        <section className={`${container} pb-16`}>
          <EditableReveal>
            <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] bg-[var(--tk-raised)] px-5 py-3">
                <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Paper preview</p>
                <a href={fileUrl} target="_blank" rel="noreferrer" className="editable-mono inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-text)] transition hover:text-[var(--tk-accent)]">
                  Full screen <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[82vh] w-full bg-[var(--tk-raised)]" />
            </div>
          </EditableReveal>
        </section>
      ) : null}

      {/* Body — two-column, no imagery in the article column */}
      <section className={`${container} pb-16`}>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <article className="min-w-0">
            <EditableReveal>
              <h2 className="editable-uppercase text-[2rem] font-semibold leading-[1] text-[var(--tk-text)] sm:text-[3rem]">
                What&apos;s in the paper.
              </h2>
            </EditableReveal>
            <BodyContent post={post} />
            <TagChips post={post} />
            {/* Repeated CTA callout — mirrors reference repeated-CTA pattern */}
            <div className="mt-14 border border-[var(--tk-line)] bg-[var(--tk-raised)] p-8 sm:p-10">
              <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">
                Keep a copy
              </p>
              <h3 className="editable-uppercase mt-3 text-[1.75rem] font-semibold leading-[1] text-[var(--tk-text)] sm:text-[2.5rem]">
                Save this for later.
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[var(--tk-muted)]">
                Download the full paper to keep it in your reference folder. Nothing tracked; no
                account needed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {fileUrl ? (
                  <a href={fileUrl} download className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110">
                    Download <Download className="h-4 w-4" />
                  </a>
                ) : null}
                {fileUrl ? (
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-text)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-white">
                    Open in tab <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* article-bottom ad — inside the article column */}
            <div className="mt-14">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>
          </article>

          {/* Sidebar — document identity + what's inside */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <EditableReveal>
              <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="flex flex-col items-center gap-4 border-b border-[var(--tk-line)] bg-[var(--tk-text)] p-8 text-white">
                  {/* Document glyph in display face — no raster image */}
                  <span className="editable-uppercase flex h-24 w-20 items-center justify-center border-2 border-[var(--slot4-accent-secondary)] bg-[var(--slot4-accent-secondary)] text-[1.75rem] font-bold text-[var(--tk-text)]">
                    {(format || 'REF').toUpperCase().slice(0, 3)}
                  </span>
                  <p className="editable-mono max-w-[220px] truncate text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                    {`${post.slug}.paper`}
                  </p>
                </div>
                <ul className="divide-y divide-[var(--tk-line)]">
                  {[
                    ['Category', category],
                    ['File size', fileSize || '—'],
                    ['Uploaded by', uploader],
                  ].map(([label, value]) => (
                    <li key={label} className="flex items-center justify-between gap-3 p-5">
                      <span className="editable-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</span>
                      <span className="editable-display truncate text-sm font-medium text-[var(--tk-text)]">{value}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[var(--tk-line)] p-5">
                  {fileUrl ? (
                    <a href={fileUrl} download className="editable-mono inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:brightness-110">
                      Download <Download className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <p className="editable-mono text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">Paper link pending</p>
                  )}
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-accent)]">
                  What&apos;s inside
                </p>
                <ul className="mt-5 grid gap-3 text-sm text-[var(--tk-text)]">
                  {insideList.map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="editable-mono mt-0.5 w-6 shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </EditableReveal>
          </aside>
        </div>
      </section>

      {/* Related — document tiles, no hero photography */}
      <PdfRelatedStrip related={related} />
    </>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className={`${container} py-16 sm:py-20`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">More from</p>
            <h2 className="editable-uppercase mt-4 text-[1.75rem] font-semibold leading-[1] text-[var(--tk-text)] sm:text-[2.75rem]">
              The Reference Library
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-text)] transition hover:text-[var(--tk-accent)]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => {
            const category = categoryOf(item, 'Reference')
            const size = getField(item, ['fileSize', 'size'])
            const format = getField(item, ['format']) || 'PDF'
            const href = `${getTaskConfig('pdf')?.route || '/pdf'}/${item.slug}`
            return (
              <EditableReveal key={item.id || item.slug} index={i} step={70}>
                <Link href={href} className="group flex h-full flex-col gap-4 border border-[var(--tk-line)] bg-white p-6 transition hover:border-[var(--tk-text)]">
                  <span className="editable-uppercase flex h-14 w-12 items-center justify-center bg-[var(--tk-text)] text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    {format.slice(0, 3)}
                  </span>
                  <h3 className="editable-display line-clamp-3 text-base font-semibold leading-snug text-[var(--tk-text)] transition group-hover:text-[var(--tk-accent)]">
                    {item.title}
                  </h3>
                  <div className="editable-mono mt-auto flex items-center justify-between gap-2 border-t border-[var(--tk-line)] pt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
                    <span>{category}</span>
                    <span className="rounded-full bg-[var(--tk-raised)] px-2.5 py-1 text-[var(--tk-text)]">{size || 'PDF'}</span>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ======================= CLASSIFIED ======================= */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className={`${container} grid gap-14 py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:py-24`}>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-8 border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
            <Kicker task="classified" />
            <h1 className="editable-uppercase mt-4 text-[1.75rem] font-semibold leading-[1] text-[var(--tk-text)] sm:text-[2rem]">{post.title}</h1>
            <p className="editable-uppercase mt-6 text-[3rem] font-bold leading-none text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-110"><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ======================= IMAGE ======================= */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className={`${container} py-20 lg:py-24`}>
        <BackLink task="image" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="editable-mono inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">
              <Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Image story
            </div>
            <h1 className="editable-uppercase mt-6 text-[2.25rem] font-semibold leading-[1] text-[var(--tk-text)] sm:text-[3rem]">{post.title}</h1>
            {leadText(post) ? <p className="mt-6 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ======================= BOOKMARK ======================= */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-20 sm:px-6 sm:py-24">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-6"><Kicker task="sbm" /></div>
        <h1 className="editable-uppercase mt-4 text-[2.5rem] font-bold leading-[1] text-[var(--tk-text)] sm:text-[3.5rem]">{post.title}</h1>
        {leadText(post) ? <p className="mt-8 text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--tk-on-accent)] transition hover:brightness-110">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ======================= PROFILE ======================= */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${container} py-20 lg:py-24`}>
        <BackLink task="profile" />
        <div className="mt-10 grid gap-14 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold">{post.title}</h1>
              {role ? <p className="editable-mono mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-accent)]">{role}</p> : null}
              <ContactAction website={website} email={email} bare />
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile" />
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ======================= Building blocks ======================= */

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-12">
      <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-5 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] border border-[var(--tk-line)] object-cover" />
        ))}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition hover:brightness-110">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-sm font-semibold transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="mt-8 border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="editable-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = taskDisplayLabel(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className={`${container} py-16 sm:py-20`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">More from</p>
            <h2 className="editable-uppercase mt-4 text-[1.75rem] font-semibold leading-[1] text-[var(--tk-text)] sm:text-[2.75rem]">{label}</h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="editable-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-text)] transition hover:text-[var(--tk-accent)]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => <RelatedCard key={item.id || item.slug} task={task} post={item} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, index }: { task: TaskKey; post: SitePost; index: number }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <EditableReveal index={index} step={70}>
      <Link href={href} className="group block overflow-hidden bg-white transition hover:-translate-y-1">
        <div className="aspect-[16/11] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="pt-5">
          <h3 className="editable-display line-clamp-2 text-base font-semibold leading-snug text-[var(--tk-text)] transition group-hover:text-[var(--tk-accent)]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    </EditableReveal>
  )
}
