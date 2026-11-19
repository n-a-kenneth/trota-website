'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { scrollToId } from '@/hooks/useLenis'
import Import from './Import'
import Security from './Security'
import Sources from './Sources'
import Split from './Split'
import Tracker from './Tracker'
import { Embedded } from './ui'

const TABS = [['import', Import], ['security', Security], ['sources', Sources], ['engine', Split], ['tracker', Tracker]]

export default function HowItWorks() {
  const { t } = useI18n()
  const [tab, setTab] = useState(0)
  const tabs = useRef([])
  const box = useRef(null)
  const inner = useRef(null)
  const [id, Panel] = TABS[tab]
  const go = (i, focusTab = true) => {
    const next = (i + TABS.length) % TABS.length
    setTab(next)
    if (focusTab) tabs.current[next]?.focus({ preventScroll: true })
    if (document.getElementById('how-panel').getBoundingClientRect().top < 64) scrollToId('how-panel')
  }
  useEffect(() => {
    const b = box.current, el = inner.current
    const fit = () => {
      if (window.innerWidth < 1024) { el.style.zoom = ''; return }
      el.style.zoom = 1
      const pad = parseFloat(getComputedStyle(b).paddingTop) + parseFloat(getComputedStyle(b).paddingBottom)
      el.style.zoom = Math.min(1, (b.clientHeight - pad) / el.scrollHeight)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(b)
    window.addEventListener('resize', fit)
    return () => { ro.disconnect(); window.removeEventListener('resize', fit) }
  }, [tab])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(tab + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(tab - 1) }
  }

  return (
    <section id="how" className="mx-auto flex max-w-6xl flex-col px-5 py-14 md:py-16 lg:h-[max(calc(100svh-4.5rem),50rem)] lg:py-6">
      <div className="shrink-0 lg:flex lg:items-end lg:justify-between lg:gap-8">
      <h2 className="font-display text-3xl leading-tight md:text-5xl">{t('nav.how')}</h2>

      <div role="tablist" aria-label={t('nav.how')} onKeyDown={onKey}
        className="mt-8 flex gap-1 lg:mt-0 overflow-x-auto rounded-full border border-line bg-surface p-1 [scrollbar-width:none] md:inline-flex">
        {TABS.map(([key], i) => (
          <button key={key} ref={(el) => { tabs.current[i] = el }} role="tab" id={`how-tab-${key}`} aria-selected={tab === i} aria-controls="how-panel"
            tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === i ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>
            <span className="font-mono text-xs opacity-70">{i + 1}</span>{t(`nav.${key}`)}
          </button>
        ))}
      </div>
      </div>

      <div id="how-panel" role="tabpanel" aria-labelledby={`how-tab-${id}`}
        ref={box} className="mt-6 overflow-hidden rounded-3xl border border-line bg-bg p-5 md:p-8 lg:mt-4 lg:min-h-0 lg:flex-1 lg:p-6">
        <Embedded.Provider value>
          <div key={id} ref={inner} className="rise relative"><Panel /></div>
        </Embedded.Provider>
      </div>

      <div className="mt-5 flex shrink-0 items-center justify-between gap-3 lg:mt-4">
        <button onClick={() => go(tab - 1, false)} disabled={tab === 0} className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold disabled:opacity-30">
          <ChevronLeft size={16} />{tab > 0 && <span className="hidden sm:inline">{t(`nav.${TABS[tab - 1][0]}`)}</span>}
        </button>
        <span className="font-mono text-xs text-muted">{tab + 1} / {TABS.length}</span>
        <button onClick={() => go(tab + 1, false)} disabled={tab === TABS.length - 1} className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg disabled:opacity-30">
          {tab < TABS.length - 1 && <span className="hidden sm:inline">{t(`nav.${TABS[tab + 1][0]}`)}</span>}<ChevronRight size={16} />
        </button>
      </div>
    </section>
  )
}
