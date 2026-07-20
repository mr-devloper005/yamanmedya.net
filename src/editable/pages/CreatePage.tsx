'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { taskDisplayLabel, taskDisplayInfo } from '@/editable/theme/task-themes'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: FileText,
}

const fieldClass =
  'h-14 rounded-full border border-[var(--editable-border)] bg-white px-5 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent-fill)]'
const textareaClass =
  'rounded-2xl border border-[var(--editable-border)] bg-white px-5 py-4 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent-fill)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? taskDisplayLabel(activeTask.key as TaskKey) : 'entry'
  const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${container} py-24 sm:py-32`}>
            <div className="grid gap-14 border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 sm:p-12 md:grid-cols-[0.9fr_1.1fr]">
              <div className="flex min-h-72 items-center justify-center bg-[var(--slot4-page-text)] text-white">
                <Lock className="h-24 w-24 opacity-70" />
              </div>
              <div className="self-center">
                <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
                  {pagesContent.create.locked.badge}
                </p>
                <h1 className="editable-uppercase mt-6 text-[2.5rem] font-bold leading-[0.98] sm:text-[3.5rem] lg:text-[4.5rem]">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110">
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-white">
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${container} py-16 sm:py-20 lg:py-28`}>
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <aside>
              <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
                {pagesContent.create.hero.badge}
              </p>
              <h1 className="editable-uppercase mt-8 text-[2.5rem] font-bold leading-[0.95] sm:text-[3.5rem] lg:text-[4.5rem]">
                {pagesContent.create.hero.title}
              </h1>
              <p className="mt-8 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  const label = taskDisplayLabel(item.key as TaskKey)
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key as TaskKey)}
                      className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition ${
                        active
                          ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white'
                          : 'border-[var(--editable-border)] bg-white hover:-translate-y-0.5 hover:border-[var(--slot4-page-text)]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="editable-display block text-lg font-semibold">{label}</span>
                      <span className="editable-mono block text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70">
                        {taskDisplayInfo(item.key as TaskKey)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
                    Filing under {activeLabel}
                  </p>
                  <h2 className="editable-uppercase mt-2 text-[2rem] font-semibold leading-[1] sm:text-[2.5rem]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="editable-mono rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">{session.name}</span>
              </div>

              <div className="mt-8 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${textareaClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${textareaClass} min-h-52`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="editable-mono text-[11px] font-semibold uppercase tracking-[0.2em]">{pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-sm">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                className="editable-mono mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
