'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { paths, size } from '@/lib/flowers.json'

const GAP = 280
const COOLDOWN = 1600
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
      out.push({ x, y, s, d: paths[Math.floor(Math.random() * paths.length)], r: Math.random() * 360, tone: Math.random() < 0.3 })
    }
  }
  return out
}

export default function Flowers() {
  const ref = useRef(null)
  const last = useRef({})
  const [items, setItems] = useState([])
  const [spins, setSpins] = useState({})

  const spin = useCallback((i, delay = 0) => {
    const now = performance.now()
    if (now - (last.current[i] || 0) < COOLDOWN) return
    last.current[i] = now
    setSpins((s) => ({ ...s, [i]: { n: (s[i]?.n || 0) + 1, dir: Math.random() < 0.5 ? -1 : 1, delay } }))
  }, [])

  useEffect(() => {
    const el = ref.current
    let w = 0, timer
    const place = () => { last.current = {}; setSpins({}); setItems(scatter(el)) }
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

  useEffect(() => {
    if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    let id
    const tick = () => {
      id = setTimeout(() => {
        const box = el.getBoundingClientRect()
        const onScreen = items.map((f, i) => [f, i]).filter(([f]) => box.top + f.y > -f.s && box.top + f.y < innerHeight + f.s)
        const pool = onScreen.length ? onScreen : items.map((f, i) => [f, i])
        const count = Math.random() < 0.25 ? 2 : 1
        for (let k = 0; k < count; k++) spin(pool[Math.floor(Math.random() * pool.length)][1], k * 0.25)
        tick()
      }, 2000 + Math.random() * 3500)
    }
    tick()

    return () => clearTimeout(id)
  }, [items, spin])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {items.map((f, i) => {
        const sp = spins[i]
        return (
          <svg key={i} data-i={i} viewBox={`0 0 ${size} ${size}`} width={f.s} height={f.s}
            className={`absolute ${f.tone ? 'text-accent-text opacity-30' : 'text-ink opacity-[0.16]'}`}
            style={{ left: f.x - f.s / 2, top: f.y - f.s / 2, transform: `rotate(${f.r}deg)` }}>
            <g key={sp?.n || 0} className={sp ? 'twirl' : undefined} style={sp ? { '--tw': `${sp.dir * 360}deg`, animationDelay: `${sp.delay}s` } : undefined}>
              <path d={f.d} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </g>
          </svg>
        )
      })}
    </div>
  )
}
