import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className="relative overflow-hidden bg-[var(--slot4-page-text)] text-white">
        <div className={`${container} pb-20 pt-24 sm:pb-24 sm:pt-32`}>
          <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-secondary)]">
            {voice.eyebrow}
          </p>
          <h1 className="editable-uppercase mt-8 max-w-4xl text-balance text-[2.5rem] font-bold leading-[0.95] sm:text-[4rem] lg:text-[5.5rem]">
            {voice.headline}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">{voice.description}</p>
          <form action={basePath} className="mt-12 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-white outline-none backdrop-blur"
            >
              <option value="all" className="text-[var(--slot4-page-text)]">All categories</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug} className="text-[var(--slot4-page-text)]">{item.name}</option>
              ))}
            </select>
            <button className="editable-mono rounded-full bg-[var(--slot4-accent-secondary)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
              Filter
            </button>
          </form>
        </div>
      </section>

      <section className={`${container} py-16 sm:py-20`}>
        {posts.length ? (
          <div className="border-b border-[var(--editable-border)]">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={index % 6}>
                <ArticleListCard post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-12 text-center">
            <h2 className="editable-uppercase text-[2rem] font-semibold">No articles found</h2>
            <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-16 flex items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className="editable-mono rounded-full border border-[var(--editable-border)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Previous
            </Link>
          ) : null}
          <span className="editable-mono rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link href={pageHref(page + 1)} className="editable-mono rounded-full border border-[var(--editable-border)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${container} pb-8 pt-16 sm:pt-24`}>
        <Link href="/article" className="editable-mono inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
          <ArrowLeft className="h-4 w-4" /> Articles
        </Link>
        <p className="editable-mono mt-12 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
          {voice.eyebrow}
        </p>
        <h1 className="editable-uppercase mt-6 max-w-5xl text-balance text-[2.75rem] font-bold leading-[0.95] sm:text-[4.5rem] lg:text-[6.5rem]">
          {post?.title || pagesContent.detailPages.article.fallbackTitle}
        </h1>
      </section>
      <section className={`${container} pb-16 pt-4 lg:pb-24`}>
        <div className="max-w-3xl">
          <p className="text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
          <Link href="/contact" className="editable-mono mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--slot4-accent-fill)]">
            Contact <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
