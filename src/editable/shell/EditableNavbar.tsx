'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, ArrowUpRight, LogOut, LogIn, PlusCircle, Sparkles, Home, Send } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const STATIC_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: Sparkles },
  { label: 'Contact', href: '/contact', icon: Send },
  { label: 'Submit', href: '/create', icon: PlusCircle, cta: true },
]

const TICKER_ITEMS = [
  'Directory · Reference Library',
  'Manually reviewed entries',
  'No algorithm · No paid placement',
  'Curated fortnightly',
  'Two shelves. Real signal.',
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  // Scroll progress bar (grows 0 → 100% down the page).
  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0
      setProgress(Math.max(0, Math.min(100, pct)))
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-md">
      {/* ── Top ticker: infinite marquee announcing the two shelves ── */}
      <div className="editable-marquee-wrap overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-page-text)] text-white">
        <div className="editable-marquee-track py-2">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="editable-marquee-segment flex shrink-0 items-center gap-12">
              {TICKER_ITEMS.map((item, i) => (
                <span key={`${dup}-${i}`} className="editable-mono flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/85">
                  <Sparkles className="h-3 w-3 text-[var(--slot4-accent-secondary)]" />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <nav className="mx-auto grid min-h-[76px] w-full max-w-[var(--editable-container)] grid-cols-[auto_1fr_auto] items-center gap-6 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center filter grayscale-100 rounded-full bg-[var(--slot4-accent-fill)] text-white transition group-hover:bg-[var(--slot4-page-text)] group-hover:grayscale-0">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[240px] truncate text-lg font-semibold leading-none tracking-[0.005em]">
              {SITE_CONFIG.name}
            </span>
            <span className="editable-mono mt-1 block max-w-[240px] truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        {/* Center nav — visually centered via the middle grid column */}
        <div className="hidden items-center justify-center gap-1 lg:flex">
          <div className="flex items-center gap-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]/50 p-1 backdrop-blur">
            {STATIC_LINKS.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              if (item.cta) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`editable-mono group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                      active
                        ? 'bg-[var(--slot4-accent-fill)] text-white'
                        : 'bg-[var(--slot4-page-text)] text-white hover:bg-[var(--slot4-accent-fill)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`editable-mono group relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                    active
                      ? 'bg-white text-[var(--slot4-page-text)] shadow-[0_1px_3px_rgba(4,4,4,0.08)]'
                      : 'text-[var(--slot4-muted-text)] hover:bg-white hover:text-[var(--slot4-page-text)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                  {active ? (
                    <span className="absolute inset-x-4 -bottom-[3px] h-[2px] rounded-full bg-[var(--slot4-accent-fill)]" />
                  ) : null}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 justify-self-end">
          {/* Search — with ⌘K hint on desktop */}
          <Link
            href="/search"
            aria-label="Search the index"
            className="group hidden h-10 items-center gap-2 rounded-full border border-[var(--editable-border)] px-3.5 text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white md:inline-flex"
          >
            <Search className="h-4 w-4" />
            <span className="editable-mono text-[10px] font-semibold uppercase tracking-[0.22em]">Search</span>
            <span className="editable-mono rounded-md border border-current/25 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] opacity-60">⌘K</span>
          </Link>
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white md:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="editable-mono hidden items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:brightness-110 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                aria-label="Log out"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-page-text)] hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="editable-mono hidden items-center gap-1.5 rounded-full border border-[var(--editable-border)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="editable-mono group hidden items-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[var(--slot4-accent-fill)] sm:inline-flex"
              >
                Get started <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Scroll-progress indicator — hairline violet that fills as you read. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
        <div
          className="h-full origin-left bg-[var(--slot4-accent-fill)] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-5 py-6 lg:hidden">
          <div className="grid gap-1">
            {STATIC_LINKS.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`editable-mono flex items-center justify-between rounded-full px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] transition ${
                    active || item.cta
                      ? 'bg-[var(--slot4-accent-fill)] text-white'
                      : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="editable-mono flex items-center justify-between rounded-full px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)] transition hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]"
            >
              <span>Search</span>
              <Search className="h-4 w-4" />
            </Link>
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="editable-mono flex items-center justify-between rounded-full px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]"
              >
                <span>Logout</span>
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="editable-mono flex items-center justify-between rounded-full border border-[var(--editable-border)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]"
                >
                  <span>Sign in</span>
                  <LogIn className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="editable-mono flex items-center justify-between rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white"
                >
                  <span>Get started</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
