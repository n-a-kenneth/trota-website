'use client'

import { useEffect, useState } from 'react'
import { paths, size } from '@/lib/flowers.json'

const MIN = 1400

export default function Splash() {
  const [phase, setPhase] = useState('in')

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
      <div className={`flex flex-col items-center transition-transform duration-700 ${phase === 'out' ? '-translate-y-3 scale-95' : ''}`}>
        <svg viewBox={`0 0 ${size} ${size}`} className="splash-flower w-24 text-accent md:w-28" aria-hidden>
          <path className="draw" pathLength="1" d={paths[0]} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="relative mt-5 font-display text-5xl italic tracking-tight md:text-6xl">
          <span className="rise inline-block" style={{ animationDelay: '250ms' }}>Trota</span>
          <svg className="absolute -bottom-2 left-0 w-full text-accent-text" viewBox="0 0 60 6" fill="none" aria-hidden>
            <path className="draw" pathLength="1" d="M1 4 Q8 0 15 4 T30 4 T45 4 T59 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" style={{ animationDelay: '600ms' }} />
          </svg>
        </span>
      </div>
    </div>
  )
}
