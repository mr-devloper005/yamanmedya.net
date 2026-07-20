'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Send, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { taskDisplayLabel } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const TRUST_CHIPS = [
  { icon: CheckCircle2, label: 'Manually reviewed' },
  { icon: ShieldCheck, label: 'No paid placement' },
  { icon: Sparkles, label: 'Independent' },
  { icon: MapPin, label: 'Locally edited' },
]

const NEWSLETTER_STORE_KEY = 'slot4:footer-newsletter'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!value) return
    try {
      const existing = JSON.parse(window.localStorage.getItem(NEWSLETTER_STORE_KEY) || '[]')
      const list = Array.isArray(existing) ? existing : []
      window.localStorage.setItem(NEWSLETTER_STORE_KEY, JSON.stringify([...new Set([value, ...list])].slice(0, 50)))
    } catch {
      window.localStorage.setItem(NEWSLETTER_STORE_KEY, JSON.stringify([value]))
    }
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* ── CTA strip: lime accent block on the left, dark on the right ── */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid w-full max-w-[var(--editable-container)] items-stretch gap-0 px-0 lg:grid-cols-[1fr_1.2fr]">
          <div className="bg-[var(--slot4-accent-secondary)] px-5 py-14 text-[var(--slot4-page-text)] sm:px-8 lg:px-10 lg:py-20">
            <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-page-text)]/70">
              Have something to add?
            </p>
            <h2 className="editable-uppercase mt-4 max-w-lg text-[2rem] font-bold leading-[0.95] sm:text-[3rem] lg:text-[3.5rem]">
              List your place, <br />share a paper.
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-6 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-end lg:px-10 lg:py-20">
            <p className="max-w-md text-sm leading-7 text-white/70">
              Submissions are reviewed by hand. Nothing goes live without an editor checking it —
              which is why the index stays small and useful.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="editable-mono inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-accent-secondary)]"
              >
                Submit <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="editable-mono inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-[var(--slot4-page-text)]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust chips row ── */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-wrap items-center gap-x-8 gap-y-4 px-5 py-6 sm:px-8 lg:px-10">
          {TRUST_CHIPS.map((chip) => (
            <span key={chip.label} className="editable-mono inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
              <chip.icon className="h-3.5 w-3.5 text-[var(--slot4-accent-secondary)]" />
              {chip.label}
            </span>
          ))}
          <span className="editable-mono ml-auto text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
            Editing since {year - 1}
          </span>
        </div>
      </div>

      {/* ── Main grid: brand + newsletter + links ── */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-10 lg:py-20">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white text-[var(--slot4-page-text)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
            </span>
            <span className="editable-display text-xl font-semibold tracking-[0.005em] text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>

          {/* Newsletter — persists locally */}
          <form onSubmit={handleSubscribe} className="mt-8 max-w-md">
            <label className="editable-mono block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
              Get quarterly updates
            </label>
            <div className="mt-3 flex overflow-hidden rounded-full border border-white/15 bg-white/5 focus-within:border-[var(--slot4-accent-secondary)]">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (subscribed) setSubscribed(false)
                }}
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="editable-mono flex shrink-0 items-center gap-2 bg-[var(--slot4-accent-secondary)] px-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-page-text)] transition hover:brightness-105"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            {subscribed ? (
              <p className="editable-mono mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-secondary)]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved — thanks
              </p>
            ) : (
              <p className="mt-3 text-[11px] leading-5 text-white/50">
                A short note four times a year. No sales, no tracking pixels.
              </p>
            )}
          </form>

          
        </div>

        <div>
          <h3 className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
            Discover
          </h3>
          <div className="mt-6 grid gap-3">
            {taskLinks.map((task) => (
              <Link
                key={task.key}
                href={task.route}
                className="group flex items-center justify-between text-sm font-medium text-white/85 transition hover:text-[var(--slot4-accent-secondary)]"
              >
                <span>{taskDisplayLabel(task.key)}</span>
                <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
            Resources
          </h3>
          <div className="mt-6 grid gap-3">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/85 transition hover:text-[var(--slot4-accent-secondary)]">
                <span>{label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
            Account
          </h3>
          <div className="mt-6 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-sm font-medium text-white/85 transition hover:text-[var(--slot4-accent-secondary)]">
                  Submit
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-left text-sm font-medium text-white/85 transition hover:text-[var(--slot4-accent-secondary)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white/85 transition hover:text-[var(--slot4-accent-secondary)]">
                  Sign in
                </Link>
                <Link href="/signup" className="text-sm font-medium text-white/85 transition hover:text-[var(--slot4-accent-secondary)]">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Massive brand wordmark — reference-style oversized display type ── */}
      <div className="editable-marquee-wrap border-y border-grey/10 overflow-hidden py-10 sm:py-14">
        <div className="editable-marquee-track is-slow">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="editable-uppercase editable-marquee-segment flex shrink-0 items-baseline gap-12 text-[4.5rem] font-bold leading-none text-grey/10 sm:text-[7rem] lg:text-[10rem]">
              <span>{SITE_CONFIG.name}</span>
              <span className="text-[var(--slot4-accent-secondary)]/25">·</span>
              <span>Directory</span>
              <span className="text-[var(--slot4-accent-secondary)]/25">·</span>
              <span>{SITE_CONFIG.name}</span>
              <span className="text-[var(--slot4-accent-secondary)]/25">·</span>
              <span>Reference Library</span>
              <span className="text-[var(--slot4-accent-secondary)]/25">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div>
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-3 px-5 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span className="editable-mono uppercase tracking-[0.22em]">Directory · Reference Library</span>
          <div className="flex items-center gap-4">
            <Link href="/about" className="editable-mono uppercase tracking-[0.22em] transition hover:text-white">
              About
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/contact" className="editable-mono uppercase tracking-[0.22em] transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
