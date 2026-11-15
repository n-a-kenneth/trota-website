'use client'

import { useEffect, useRef, useState } from 'react'

export const fill = (s, o) => Object.entries(o).reduce((a, [k, v]) => a.replaceAll(`{${k}}`, v), s)

export function useInView(threshold = 0.3) {
  const ref = useRef()
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

export function useVisible(threshold = 0.25) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, visible]
}

export function useLater(ms) {
  const [on, setOn] = useState(false)
  useEffect(() => { const id = setTimeout(() => setOn(true), ms); return () => clearTimeout(id) }, [ms])
  return on
}

export function useCount(to, from = 0) {
  const [v, setV] = useState(from)
  useEffect(() => {
    let raf, t0
    const f = (t) => { t0 = t0 ?? t; const p = Math.min(1, (t - t0) / 1100); setV(Math.round(from + (to - from) * (1 - (1 - p) ** 3))); if (p < 1) raf = requestAnimationFrame(f) }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [to, from])
  return v
}

export function Marked({ text }) {
  return text.split(/\[\[(.+?)\]\]/g).map((p, i) => (i % 2 ? <mark key={i} className="marker">{p}</mark> : p))
}

export function Toggle({ on, onChange, tone = 'accent', children }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex items-center gap-3 text-left text-sm">
      <span className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${on ? (tone === 'warn' ? 'bg-warn' : 'bg-accent') : 'bg-ink/20'}`}>
        <i className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </span>
      {children}
    </button>
  )
}

export function Seg({ value, onChange, options }) {
  return (
    <div role="group" className="inline-flex rounded-full border border-line p-1">
      {options.map(([v, label, tone]) => (
        <button key={String(v)} aria-pressed={value === v} onClick={() => onChange(v)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${value === v ? (tone === 'warn' ? 'bg-warn text-bg' : 'bg-accent text-accent-ink') : 'text-muted'}`}>{label}</button>
      ))}
    </div>
  )
}

export function useActive(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids.join()])
  return active
}

export function More({ label, items }) {
  if (!Array.isArray(items)) return null
  return (
    <details className="group mt-8 border-t border-line/30 pt-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="grid h-5 w-5 place-items-center rounded-full border border-line text-xs transition-transform group-open:rotate-45">+</span>{label}
      </summary>
      <ul className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-muted">
        {items.map((x) => <li key={x} className="border-l-2 border-accent-text/60 pl-4">{x}</li>)}
      </ul>
    </details>
  )
}
