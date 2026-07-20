'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  index?: number
  as?: 'div' | 'section' | 'article' | 'header' | 'li' | 'span'
  className?: string
  style?: CSSProperties
  /** Delay per stagger step, in ms (default 90). */
  step?: number
  /** Base delay before the stagger begins, in ms (default 0). */
  baseDelay?: number
  once?: boolean
}

/*
  Scroll-reveal wrapper.

  IntersectionObserver-driven fade + slide-up. The hidden state is applied
  only *after* mount so JS-off visitors see content immediately, and a
  `prefers-reduced-motion` guard in editable-global.css bypasses the motion.
*/
export function EditableReveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
  style,
  step = 90,
  baseDelay = 0,
  once = true,
}: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(el)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const state = !mounted ? 'is-visible' : visible ? 'is-visible' : 'is-hidden'
  const delay = baseDelay + step * Math.max(0, index)
  const composed: CSSProperties = { transitionDelay: `${delay}ms`, ...style }

  return (
    <Tag
      ref={ref as never}
      className={`editable-reveal ${state} ${className}`}
      style={composed}
    >
      {children}
    </Tag>
  )
}
