import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { taskDisplayLabel } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => toPlainText(
  (typeof post.summary === 'string' && post.summary) ||
  compactRaw(getContent(post).description) ||
  compactRaw(getContent(post).excerpt) ||
  compactRaw(getContent(post).body) ||
  '',
)

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = task ? taskDisplayLabel(task) : 'Entry'

  return (
    <Link href={href} className="group grid grid-cols-[auto_1fr] items-start gap-6 border-t border-[var(--editable-border)] py-8 transition hover:pl-3">
      {image ? (
        <div className="relative h-24 w-32 shrink-0 overflow-hidden bg-[var(--slot4-media-bg)] sm:h-28 sm:w-40">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
      ) : (
        <div className="flex h-24 w-32 shrink-0 items-center justify-center bg-[var(--slot4-panel-bg)] sm:h-28 sm:w-40">
          <span className="editable-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{label}</span>
        </div>
      )}
      <div className="min-w-0">
        <p className="editable-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">
          {label}
        </p>
        <h2 className="editable-uppercase mt-2 line-clamp-2 text-[1.5rem] font-semibold leading-[1.02] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent-fill)] sm:text-[2rem]">
          {post.title}
        </h2>
        {summary ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="editable-mono mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)]">
          Open result <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero: violet block with search inside */}
        <section className="relative overflow-hidden bg-[var(--slot4-accent-fill)] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(86,72,228,0.9),rgba(4,4,4,0.4))]" />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36">
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
              {pagesContent.search.hero.badge}
            </p>
            <h1 className="editable-uppercase mt-6 max-w-4xl text-balance text-[2.5rem] font-bold leading-[0.95] sm:text-[4rem] lg:text-[5.5rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">{pagesContent.search.hero.description}</p>

            <form action="/search" className="mt-12 grid gap-3 sm:grid-cols-[1.5fr_1fr_1fr_auto]">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full bg-white px-5 py-3">
                <Search className="h-4 w-4 text-[var(--slot4-page-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <label className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-white backdrop-blur">
                <Filter className="h-4 w-4" />
                <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-white/60" />
              </label>
              <select name="task" defaultValue={task} className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white outline-none backdrop-blur">
                <option value="" className="text-[var(--slot4-page-text)]">All shelves</option>
                {enabledTasks.map((item) => (
                  <option key={item.key} value={item.key} className="text-[var(--slot4-page-text)]">
                    {taskDisplayLabel(item.key as TaskKey)}
                  </option>
                ))}
              </select>
              <button className="editable-mono inline-flex items-center justify-center rounded-full bg-[var(--slot4-accent-secondary)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-page-text)] transition hover:brightness-105" type="submit">
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <h2 className="editable-uppercase mt-4 text-[2rem] font-semibold leading-[1] text-[var(--slot4-page-text)] sm:text-[2.75rem]">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/" className="editable-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent-fill)]">
              Back to home <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-10 border-b border-[var(--editable-border)]">
              {results.map((post) => <SearchResultCard key={post.id || post.slug} post={post} />)}
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-14 text-center">
              <p className="editable-uppercase text-[1.5rem] font-semibold text-[var(--slot4-page-text)] sm:text-[2rem]">No matching entries.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, shelf, or category.</p>
            </div>
          )}

          {/* Footer ad per rules */}
          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
