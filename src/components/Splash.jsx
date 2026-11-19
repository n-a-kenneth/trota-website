'use client'

import { useEffect, useState } from 'react'

const MIN = 2700
const mask = (src) => ({ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' })

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
      <div className={`relative aspect-[5328/2874] w-[min(70vw,420px)] transition-transform duration-700 ${phase === 'out' ? 'scale-95' : ''}`}>
        <span className="logo-in absolute inset-0">
          <span className="logo-turn absolute inset-0 bg-accent" style={mask('/logo/flower.png')} />
        </span>
        <span className="logo-word absolute inset-0 bg-ink" style={mask('/logo/wordmark.png')} />
      </div>
    </div>
  )
}
