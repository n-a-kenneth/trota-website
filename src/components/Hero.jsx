'use client'

import { useEffect, useState } from 'react'
import { Lock, Loader2, Check, RotateCcw, BadgeCheck, ArrowDown } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { scrollToId } from '@/hooks/useLenis'
import { paths, size } from '@/lib/flowers.json'
import { Wordmark } from './Logo'

function Phone() {
  const { t, lang } = useI18n()
  const [stage, setStage] = useState(0)
  const [typed, setTyped] = useState(0)
  const [run, setRun] = useState(0)
  const answer = t('hero.a')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage(3); setTyped(answer.length); return }
    setStage(0); setTyped(0)
    const ts = [setTimeout(() => setStage(1), 600), setTimeout(() => setStage(2), 1700), setTimeout(() => setStage(3), 3300)]
    return () => ts.forEach(clearTimeout)
  }, [run, lang, answer.length])
  useEffect(() => {
    if (stage !== 3 || typed >= answer.length) return
    const id = setTimeout(() => setTyped((n) => n + 1), 18)
    return () => clearTimeout(id)
  }, [stage, typed, answer])
  const done = stage === 3 && typed >= answer.length

  return (
    <div className="relative mx-auto w-full max-w-[300px] -rotate-2 rounded-[2.6rem] border border-line bg-surface p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)] dark:shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] transition-transform duration-500 hover:rotate-0">
      <div className="flex items-center justify-between">
        <span className="font-display text-xl italic">Trota</span>
        <span className="flex items-center gap-1.5 rounded-full bg-bg px-2.5 py-1 text-[11px]"><Lock size={11} />{t('hero.badge')}</span>
      </div>
      <div className="mt-5 min-h-[300px]">
        {stage >= 1 && <p className="rise ml-auto w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm text-accent-ink">{t('hero.q')}</p>}
        {stage >= 2 && (
          <p className="rise mt-3 flex items-center gap-2 text-xs text-muted">
            {stage === 2 ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} className="text-accent-text" />}{stage === 2 ? t('hero.work') : t('hero.foot')}
          </p>
        )}
        {stage >= 3 && (
          <p className="rise mt-3 w-[94%] rounded-2xl rounded-bl-md bg-bg px-4 py-3 text-sm leading-relaxed">
            {answer.slice(0, typed)}{typed < answer.length && <span className="caret">▍</span>}
            {done && <sup className="rise ml-0.5 font-mono text-accent-text">[1]</sup>}
          </p>
        )}
        {done && <p className="rise mt-2 flex items-center gap-1.5 text-xs text-muted"><BadgeCheck size={13} className="text-accent-text" />[1] {t('hero.cite')}</p>}
      </div>
      <button onClick={() => setRun((r) => r + 1)} className="mx-auto mt-1 flex items-center text-muted hover:text-ink" aria-label="Replay"><RotateCcw size={12} /></button>
    </div>
  )
}

function Title({ text }) {
  return text.split(/\[\[(.+?)\]\]/g).map((p, i) => i % 2
    ? <em key={i} className="relative isolate inline-block whitespace-nowrap italic text-accent-text">{p}
        <svg className="absolute -bottom-[0.02em] -left-[0.08em] -z-10 h-[0.32em] w-[calc(100%+0.16em)]" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden><path className="draw" pathLength="1" d="M3 8 C 30 3, 62 10, 117 5" fill="none" stroke="rgb(var(--accent))" strokeWidth="7" strokeLinecap="round" opacity=".55" style={{ animationDelay: '900ms' }} /></svg>
      </em>
    : p)
}

export default function Hero() {
  const { t } = useI18n()
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-14 md:pb-24 md:pt-24 lg:grid-cols-[1.25fr_1fr]">
      <div>
        <Wordmark draw delay={500} className="rise mb-8 text-4xl md:text-5xl" />
        <h1 className="rise font-display text-5xl leading-[1.02] tracking-tight md:text-7xl"><Title text={t('hero.title')} /></h1>
        <p className="rise mt-8 max-w-lg text-lg leading-relaxed text-muted" style={{ animationDelay: '300ms' }}>{t('hero.sub')}</p>
        <div className="rise mt-10 flex flex-wrap items-center gap-6" style={{ animationDelay: '450ms' }}>
          <button onClick={() => scrollToId('about')} className="rounded-full bg-ink px-6 py-3 font-semibold text-bg transition-transform hover:-translate-y-0.5">{t('hero.demo')}</button>
          <button onClick={() => scrollToId('import')} className="group flex items-center gap-2 font-semibold underline decoration-accent decoration-2 underline-offset-8">{t('hero.howbtn')}<ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" /></button>
        </div>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${size} ${size}`} className="absolute -bottom-20 -left-16 -z-10 w-64 text-accent md:w-80" aria-hidden>
          <path className="draw" pathLength="1" d={paths[0]} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Phone />
      </div>
    </section>
  )
}
