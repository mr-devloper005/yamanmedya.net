import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-[var(--editable-container)] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-28">
          <div>
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
              {pagesContent.auth.login.badge}
            </p>
            <h1 className="editable-uppercase mt-8 max-w-xl text-[2.5rem] font-bold leading-[0.95] sm:text-[4rem] lg:text-[5rem]">
              {pagesContent.auth.login.title}
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.auth.login.description}</p>
          </div>
          <div className="border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
            <h2 className="editable-uppercase text-[1.75rem] font-semibold">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
              New here?{' '}
              <Link href="/signup" className="editable-mono ml-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent-fill)]">
                {pagesContent.auth.login.createCta} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
