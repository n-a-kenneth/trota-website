'use client'

import { useState } from 'react'
import { Maximize2, X } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'

const PROTO = 'https://www.figma.com/proto/GYHF9OM22CizH3049eUJJo/Health-Wellness-Mobile-App?node-id=227-158766&p=f&m=dev&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=227%3A158766&show-proto-sidebar=1&t=HKxwQVd41tqUvqSe-1'
const FRAME = { w: 390, h: 844 }
const PAD = 34

function embedUrl() {
  const u = new URL(PROTO)
  ;['show-proto-sidebar', 'm'].forEach((k) => u.searchParams.delete(k))
  u.searchParams.set('scaling', 'contain')
  u.searchParams.set('hide-ui', '1')
  u.searchParams.set('hotspot-hints', '0')
  return `https://www.figma.com/embed?embed_host=share&proto=true&url=${encodeURIComponent(u.toString())}`
}
const SRC = embedUrl()

function Screen({ onLoad }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <iframe title="Trota prototype" src={SRC} onLoad={onLoad} allowFullScreen className="absolute border-0"
        style={{ left: -PAD, width: `calc(100% + ${PAD * 2}px)`, top: '-50%', height: '200%' }} />
    </div>
  )
}

export default function About() {
  const { t } = useI18n()
  const [loaded, setLoaded] = useState(false)
  const [full, setFull] = useState(false)
  const h = full ? 'min(92svh, 900px)' : 'min(78svh, 700px)'
  const phone = { height: h, width: `calc(${h} * ${FRAME.w} / ${FRAME.h})`, maxWidth: '100%' }
  const device = (
    <div style={phone} className="relative shrink-0 overflow-hidden rounded-[2.4rem] bg-black p-[7px] shadow-xl ring-1 ring-line">
      <div className="relative h-full w-full overflow-hidden rounded-[1.9rem]">
        {!loaded && <div className="absolute inset-0 z-10 grid place-items-center animate-pulse bg-surface text-sm text-muted">{t('about.load')}</div>}
        <Screen onLoad={() => setLoaded(true)} />
      </div>
    </div>
  )

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl leading-tight md:text-5xl">{t('about.title')}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted"><p>{t('about.p1')}</p><p>{t('about.p2')}</p><p>{t('about.p3')}</p></div>
          <button onClick={() => setFull(true)} className="mt-8 flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-bg"><Maximize2 size={15} />{t('about.full')}</button>
        </div>
        {full
          ? <div className="fixed inset-0 z-50 grid place-items-center bg-bg/95 p-4" onClick={() => setFull(false)}>
              <div onClick={(e) => e.stopPropagation()}>{device}</div>
              <button onClick={() => setFull(false)} className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm"><X size={15} />{t('about.exit')}</button>
            </div>
          : <div className="flex justify-center">{device}</div>}
      </div>
    </section>
  )
}
