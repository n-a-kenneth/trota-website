'use client'

import { useEffect, useState } from 'react'
import { Mark, Wordmark } from './Logo'

const MIN = 2400

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
      <div className={`relative grid h-64 w-64 place-items-center transition-transform duration-700 md:h-80 md:w-80 ${phase === 'out' ? '-translate-y-3 scale-95' : ''}`}>
        <Mark draw duration="1.8s" strokeWidth={3} className="splash-flower absolute inset-0 h-full w-full text-accent" />
        <Wordmark draw delay={700} className="rise relative text-4xl md:text-5xl" />
      </div>
    </div>
  )
}
