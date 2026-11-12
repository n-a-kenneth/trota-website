'use client'

import { useEffect, useRef, useState } from 'react'
import { paths, size } from '@/lib/flowers.json'

const GAP = 280
const AVOID = 'h1,h2,h3,p,li,button,a,input,label,table,img,iframe,pre,[class*="bg-surface"],[class*="bg-accent"]'

function scatter(root) {
  const box = root.getBoundingClientRect()
  const w = box.width, h = box.height
  const blocks = [...root.parentElement.querySelectorAll(AVOID)]
    .filter((el) => !root.contains(el))
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width && r.height)
    .map((r) => ({ l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top }))
  const free = (x, y, rad) => blocks.every((b) => x + rad < b.l || x - rad > b.r || y + rad < b.t || y - rad > b.b)
  const n = Math.round((w * h) / (GAP * GAP * 1.6))
  const out = []
  for (let tries = 0; out.length < n && tries < n * 60; tries++) {
    const s = 56 + Math.random() * 100
    const x = Math.random() * w, y = Math.random() * h
    if (free(x, y, s * 0.42) && out.every((f) => Math.hypot(f.x - x, f.y - y) > GAP)) {
      out.push({ x, y, s, d: paths[Math.floor(Math.random() * paths.length)], r: Math.random() * 360, tone: Math.random() < 0.3, delay: -Math.random() * 14 })
    }
  }
  return out
}

export default function Flowers() {
  const ref = useRef(null)
  const [items, setItems] = useState([])
  useEffect(() => {
    const el = ref.current
    let w = 0, timer
    const place = () => setItems(scatter(el))
    const ro = new ResizeObserver(([e]) => {
      if (Math.abs(e.contentRect.width - w) < 80 && w) return
      w = e.contentRect.width
      clearTimeout(timer)
      timer = setTimeout(place, 400)
    })
    ro.observe(el)
    document.fonts?.ready.then(place)
    return () => { ro.disconnect(); clearTimeout(timer) }
  }, [])
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {items.map((f, i) => (
        <svg key={i} viewBox={`0 0 ${size} ${size}`} width={f.s} height={f.s}
          className={`drift absolute ${f.tone ? 'text-accent-text opacity-30' : 'text-ink opacity-[0.16]'}`}
          style={{ left: f.x - f.s / 2, top: f.y - f.s / 2, '--r': `${f.r}deg`, animationDelay: `${f.delay}s` }}>
          <path d={f.d} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
    </div>
  )
}
