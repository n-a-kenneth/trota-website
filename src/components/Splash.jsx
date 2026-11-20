'use client'

import { useEffect, useState } from 'react'
import { paths, size } from '@/lib/flowers.json'

const MIN = 3000
const mask = (src) => ({ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' })

function poisson(w, h, minDist) {
  const cell = minDist / Math.SQRT2
  const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell)
  const grid = new Array(cols * rows).fill(null)
  const pts = [], active = []
  const add = (p) => { pts.push(p); active.push(p); grid[Math.floor(p[1] / cell) * cols + Math.floor(p[0] / cell)] = p }
  const ok = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return false
    const gx = Math.floor(x / cell), gy = Math.floor(y / cell)
    for (let j = Math.max(0, gy - 2); j <= Math.min(rows - 1, gy + 2); j++)
      for (let i = Math.max(0, gx - 2); i <= Math.min(cols - 1, gx + 2); i++) {
        const q = grid[j * cols + i]
        if (q && Math.hypot(q[0] - x, q[1] - y) < minDist) return false
      }
    return true
  }
  add([Math.random() * w, Math.random() * h])
  while (active.length) {
    const k = Math.floor(Math.random() * active.length), [px, py] = active[k]
    let found = false
    for (let t = 0; t < 30; t++) {
      const a = Math.random() * Math.PI * 2, d = minDist * (1 + Math.random())
      const x = px + Math.cos(a) * d, y = py + Math.sin(a) * d
      if (ok(x, y)) { add([x, y]); found = true; break }
    }
    if (!found) active.splice(k, 1)
  }
  return pts
}

function scatter(w, h) {
  const logoW = Math.min(w * 0.7, 420), logoH = logoW / 1.854
  const clear = { l: (w - logoW) / 2 - 40, r: (w + logoW) / 2 + 40, t: (h - logoH) / 2 - 40, b: (h + logoH) / 2 + 40 }
  const gap = Math.max(95, Math.min(130, Math.sqrt((w * h) / 80)))
  const cx = w / 2, cy = h / 2, far = Math.hypot(cx, cy)
  return poisson(w + 80, h + 80, gap)
    .map(([x, y]) => [x - 40, y - 40])
    .map(([x, y]) => ({ x, y, s: gap * (0.5 + Math.random() * 0.45) }))
    .filter(({ x, y, s }) => !(x + s * 0.45 > clear.l && x - s * 0.45 < clear.r && y + s * 0.45 > clear.t && y - s * 0.45 < clear.b))
    .map((f) => ({ ...f, d: paths[Math.floor(Math.random() * paths.length)], r: Math.random() * 360, tone: Math.random() < 0.3,
      delay: 0.05 + (Math.hypot(f.x - cx, f.y - cy) / far) * 0.7 + Math.random() * 0.1 }))
}

export default function Splash() {
  const [phase, setPhase] = useState('in')
  const [bloom, setBloom] = useState([])

  useEffect(() => { setBloom(scatter(window.innerWidth, window.innerHeight)) }, [])

  useEffect(() => {
    const start = performance.now()
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }))
    let t1, t2
    Promise.all([loaded, document.fonts?.ready]).then(() => {
      t1 = setTimeout(() => {
        setPhase('out')
        t2 = setTimeout(() => setPhase('gone'), 700)
      }, Math.max(0, MIN - (performance.now() - start)))
    })
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'gone') return null
  return (
    <div role="status" aria-label="Loading Trota"
      className={`splash fixed inset-0 z-[200] grid place-items-center bg-bg transition-opacity duration-700 ${phase === 'out' ? 'pointer-events-none opacity-0' : ''}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {bloom.map((f, i) => (
          <span key={i} className="splash-pop absolute" style={{ left: f.x - f.s / 2, top: f.y - f.s / 2, width: f.s, height: f.s, animationDelay: `${f.delay}s` }}>
            <svg viewBox={`0 0 ${size} ${size}`} className={`h-full w-full ${f.tone ? 'text-accent-text opacity-30' : 'text-ink opacity-[0.16]'}`} style={{ transform: `rotate(${f.r}deg)` }}>
              <path d={f.d} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </span>
        ))}
      </div>
      <div className={`relative aspect-[5328/2874] w-[min(70vw,420px)] transition-transform duration-700 ${phase === 'out' ? 'scale-95' : ''}`}>
        <span className="logo-in absolute inset-0">
          <span className="absolute inset-0 bg-accent" style={mask('/logo/flower.png')} />
        </span>
        <span className="logo-word absolute inset-0 bg-ink" style={mask('/logo/wordmark.png')} />
      </div>
    </div>
  )
}
