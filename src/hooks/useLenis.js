'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

const KEY = 'trota-scroll'

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

function jump(y) {
  if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo(0, y)
}

function useScrollMemory() {
  useEffect(() => {
    history.scrollRestoration = 'manual'
    const reload = performance.getEntriesByType('navigation')[0]?.type === 'reload'
    let saved = 0
    try { saved = reload ? Number(sessionStorage.getItem(KEY)) || 0 : 0 } catch {}
    if (!reload && location.hash) history.replaceState(null, '', location.pathname + location.search)

    jump(0)
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }))
    let settle
    Promise.all([loaded, document.fonts?.ready]).then(() => { settle = setTimeout(() => jump(saved), 150) })

    let pending = false
    const save = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(() => {
        pending = false
        try { sessionStorage.setItem(KEY, String(Math.round(window.scrollY))) } catch {}
      })
    }
    window.addEventListener('scroll', save, { passive: true })
    window.addEventListener('pagehide', save)
    return () => { clearTimeout(settle); window.removeEventListener('scroll', save); window.removeEventListener('pagehide', save) }
  }, [])
}

export default function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, autoRaf: true })
    window.__lenis = lenis
    return () => { lenis.destroy(); window.__lenis = null }
  }, [])
  useScrollMemory()
}
