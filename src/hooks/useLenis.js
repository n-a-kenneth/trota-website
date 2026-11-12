'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export default function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, autoRaf: true })
    window.__lenis = lenis
    return () => { lenis.destroy(); window.__lenis = null }
  }, [])
}
