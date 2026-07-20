import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

// Reduce any content payload — rich HTML, entity-encoded HTML, or plain text —
// to a clean card excerpt.
export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
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
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
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

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ---------- Feature card ---------- */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block min-w-0 overflow-hidden bg-[var(--slot4-page-text)] text-white">
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[640px] lg:p-14">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,4,0.15),rgba(4,4,4,0.88))]" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-end lg:min-h-[560px]">
          <span className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
            {label}
          </span>
          <h3 className="editable-uppercase mt-6 max-w-3xl text-[2.5rem] font-bold leading-[0.95] sm:text-[3.5rem] lg:text-[5rem]">
            {post.title}
          </h3>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
            {getEditableExcerpt(post, 200)}
          </p>
          <span className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-secondary)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)]">
            Open <ArrowUpRight className={`h-4 w-4 ${dc.motion.arrow}`} />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ---------- Rail card (horizontal scroll) ---------- */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden bg-white`}>
      <div className={`${dc.media.frame} ${dc.media.editorial}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
        <span className="editable-mono absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="pb-2 pt-5">
        <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
          {getEditableCategory(post)}
        </p>
        <h3 className="editable-display mt-3 line-clamp-2 text-xl font-semibold leading-tight text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 120)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--slot4-page-text)]">
          Read <ArrowUpRight className={`h-3.5 w-3.5 ${dc.motion.arrow}`} />
        </span>
      </div>
    </Link>
  )
}

/* ---------- Compact index (numbered list card) ---------- */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group block min-w-0 border-t border-[var(--editable-border)] py-6 transition hover:pl-3"
    >
      <div className="flex items-start gap-6">
        <span className="editable-mono w-10 shrink-0 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
            {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-2 text-xl font-semibold leading-snug tracking-[-0.005em] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent-fill)]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">
            {getEditableExcerpt(post, 130)}
          </p>
        </div>
        <ArrowUpRight className={`mt-1 h-5 w-5 shrink-0 text-[var(--slot4-muted-text)] ${dc.motion.arrow} group-hover:text-[var(--slot4-page-text)]`} />
      </div>
    </Link>
  )
}

/* ---------- Editorial list card (image + text side-by-side) ---------- */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group grid min-w-0 gap-8 border-t border-[var(--editable-border)] py-10 transition sm:grid-cols-[360px_minmax(0,1fr)]"
    >
      <div className={`${dc.media.frame} ${dc.media.editorial} sm:min-h-[220px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
      </div>
      <div className="min-w-0">
        <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
          {getEditableCategory(post)} · No. {String(index + 1).padStart(2, '0')}
        </p>
        <h2 className="editable-uppercase mt-4 line-clamp-3 text-[1.75rem] font-semibold leading-[0.98] sm:text-[2.5rem] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent-fill)]">
          {post.title}
        </h2>
        <p className="mt-5 line-clamp-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 200)}
        </p>
        <span className="editable-mono mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
          Open article <ArrowUpRight className={`h-4 w-4 ${dc.motion.arrow}`} />
        </span>
      </div>
    </Link>
  )
}
