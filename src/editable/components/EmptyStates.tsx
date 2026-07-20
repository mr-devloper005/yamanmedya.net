import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing filed here yet',
  description = 'Entries will appear here automatically once new items are added to this shelf.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-10 text-center', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-fill)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-uppercase mt-6 text-[1.75rem] font-semibold leading-[1] text-[var(--slot4-page-text)] sm:text-[2rem]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--slot4-muted-text)]">{description}</p>
      <Link
        href={actionHref}
        className="editable-mono mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-white"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The page layout stays ready even when the feed is empty.`}
      actionLabel="Explore the index"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
