'use client'

import { useEffect, useState } from 'react'
import { Braces, Sparkles, ArrowRight, ArrowDown, Check } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { useInView, Marked } from './ui'
import Section from './Section'

const PROMPTS = ['p1', 'p2', 'p3']
const WINDOW = 16000, PER_MONTH = 700, SUMMARY = 900

function Box({ on = true, children }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 transition-all duration-500 ${on ? '' : 'opacity-50'}`}>{children}</div>
}
function Link({ on }) {
  return <div className={`grid place-items-center transition-colors duration-500 ${on ? 'text-accent-text' : 'text-ink/25'}`}><ArrowRight size={22} className="hidden md:block" /><ArrowDown size={22} className="md:hidden" /></div>
}
function Bar({ label, tokens, full, good, t }) {
  const pct = Math.min(100, (tokens / WINDOW) * 100)
  return (
    <div>
      <p className="mb-1 flex justify-between text-sm"><span className="font-semibold">{label}</span><span className={`font-mono text-xs ${full ? 'text-warn' : 'text-muted'}`}>{full ? t('eng.mFull') : `${tokens.toLocaleString()} / ${WINDOW.toLocaleString()}`}</span></p>
      <div className="h-5 overflow-hidden rounded-full border border-line bg-bg"><div className={`h-full transition-all duration-500 ${good ? 'bg-accent-text' : full ? 'bg-warn' : 'bg-ink/50'}`} style={{ width: `${Math.max(pct, 2)}%` }} /></div>
    </div>
  )
}

export default function Split() {
  const { t } = useI18n()
  const [ref, seen] = useInView(0.25)
  const [pi, setPi] = useState(0)
  const [step, setStep] = useState(0)
  const [months, setMonths] = useState(6)
  useEffect(() => {
    if (!seen) return
    setStep(0)
    const ts = [1, 2, 3, 4].map((s, i) => setTimeout(() => setStep(s), (i + 1) * 1400))
    return () => ts.forEach(clearTimeout)
  }, [pi, seen])
  const p = PROMPTS[pi]
  const k = (x) => t(`eng.${p}.${x}`)
  const typ = months * PER_MONTH

  return (
    <Section id="engine" title={t('eng.title')} lead={t('eng.lead')} more="eng">
      <div ref={ref}>
        <div className="grid items-stretch gap-3 md:min-h-[34rem] lg:min-h-[28.5rem] md:grid-cols-[1fr_auto_1.5fr_auto_1fr]">
          <Box>
            <p className="font-mono text-xs text-muted">{t('eng.you')}</p>
            <div className="mt-3 space-y-2">
              {PROMPTS.map((id, i) => (
                <button key={id} onClick={() => setPi(i)} aria-pressed={pi === i}
                  className={`block w-full rounded-2xl px-4 py-3 text-left text-sm transition-colors ${pi === i ? 'rounded-br-sm bg-accent text-accent-ink' : 'border border-line text-muted hover:text-ink'}`}>{t(`eng.${id}.q`)}</button>
              ))}
            </div>
          </Box>
          <Link on={step >= 1} />
          <div className="space-y-3">
            <Box on={step >= 1}>
              <p className="flex items-center gap-2 font-display text-lg"><Braces size={18} className="text-accent-text" />{t('eng.det')}</p>
              <p className="mt-1 text-sm text-muted">{t('eng.detD')}</p>
              <ul className="mt-4 space-y-2">
                {[['c1', 'r1'], ['c2', 'r2']].map(([c, r], i) => (
                  <li key={c} className="rounded-xl bg-bg px-3 py-2 text-sm">
                    <p className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${i * 200}ms` }}>{k(c)}</p>
                    <p className={`mt-1 flex items-center gap-1.5 font-mono text-xs text-accent-text ${step >= 2 ? 'rise' : 'invisible'}`} style={{ animationDelay: `${i * 250}ms` }}><Check size={12} />{k(r)}</p>
                  </li>
                ))}
              </ul>
            </Box>
            <Box on={step >= 1}>
              <p className="flex items-center gap-2 font-display text-lg"><Sparkles size={18} className="text-accent-text" />{t('eng.prob')}</p>
              <p className="mt-1 text-sm text-muted">{t('eng.probD')}</p>
              <p className={`mt-4 rounded-xl bg-bg px-3 py-2 text-sm transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>{k('a')}</p>
              <p className={`mt-2 rounded-xl border border-dashed border-line px-3 py-2 text-xs ${step >= 3 ? 'rise' : 'invisible'}`}><span className="block font-mono text-muted">{t('eng.packet')}</span>{k('pk')}</p>
            </Box>
          </div>
          <Link on={step >= 3} />
          <Box on={step >= 4}>
            <p className="font-mono text-xs text-muted">{t('eng.answer')}</p>
            <div className="mt-3 min-h-[11rem] text-sm leading-relaxed"><p key={p} className={step >= 4 ? 'rise' : 'invisible'}><Marked text={k('ans')} /></p></div>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted"><span><mark className="marker">123</mark> {t('eng.legC')}</span><span>Aa {t('eng.legA')}</span></p>
          </Box>
        </div>

        <div className="mt-5 grid gap-5 rounded-2xl border border-line bg-surface p-5 md:grid-cols-[15rem_1fr] md:items-center">
          <div>
            <p className="font-display text-lg">{t('eng.mTitle')}</p>
            <label htmlFor="months" className="mt-3 flex items-center justify-between text-sm font-semibold">{t('eng.mMonths')}<span className="font-display text-lg">{months}</span></label>
            <input id="months" type="range" min="1" max="24" value={months} onChange={(e) => setMonths(+e.target.value)} className="mt-1 w-full accent-[rgb(var(--accent-text))]" />
          </div>
          <div className="space-y-3">
            <Bar label={t('eng.mAll')} tokens={typ} full={typ > WINDOW} t={t} />
            <Bar label={t('eng.mSum')} tokens={SUMMARY} good t={t} />
            <p className="text-xs text-muted">{t('eng.mNote')}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
