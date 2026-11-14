'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Trash2, Bell, Check, Lock, RotateCcw } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { fill, useCount, Toggle } from './ui'
import Section from './Section'

const ROWS = 1284
const SOURCES = [['apple', 'Apple Health'], ['connect', 'Health Connect'], ['file', null]]
const FIELDS = {
  apple: [['HKCategoryTypeIdentifierMenstrualFlow', 'period'], ['HKCategoryTypeIdentifierSleepAnalysis', 'sleep'], ['HKCategoryTypeIdentifierHeadache', 'symptom']],
  connect: [['MenstruationPeriodRecord', 'period'], ['SleepSessionRecord', 'sleep']],
  file: [['date', 'date'], ['cycle_day', 'period'], ['symptom', 'symptom']],
}
const REMIND = { weekly: 1, monthly: 4, never: null }
const card = 'rounded-2xl border border-line bg-surface p-5 '
const btn = 'rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors'

export default function Import() {
  const { t } = useI18n()
  const [src, setSrc] = useState('apple')
  const [phase, setPhase] = useState('idle')
  const [weeks, setWeeks] = useState(6)
  const [remind, setRemind] = useState('monthly')
  const [pers, setPers] = useState(true)
  const [share, setShare] = useState(false)
  const [del, setDel] = useState('none')
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])
  const rows = useCount(phase === 'idle' ? 0 : ROWS, 0)

  const run = () => { setPhase('reading'); timer.current = setTimeout(() => setPhase('done'), 1700) }
  const pick = (k) => { clearTimeout(timer.current); setSrc(k); setPhase('idle') }
  const exportJson = () => {
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify({ source: src, rows: ROWS, fields: FIELDS[src] }, null, 2)], { type: 'application/json' })), download: 'trota-export.json' })
    a.click(); URL.revokeObjectURL(a.href)
  }
  const half = 3 + weeks * 0.35
  const lo = Math.round(32 - half), hi = Math.round(32 + half)
  const due = REMIND[remind] !== null && weeks >= REMIND[remind]

  return (
    <Section id="import" title={t('inp.title')} lead={t('inp.lead')} more="inp">
      <div className="grid gap-5 lg:grid-cols-3">
        <div className={card}>
          <p className="font-display text-xl">{t('inp.c1')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOURCES.map(([k, label]) => <button key={k} onClick={() => pick(k)} aria-pressed={src === k} className={`${btn} ${src === k ? 'bg-accent text-accent-ink' : 'hover:bg-bg'}`}>{label ?? t('inp.file')}</button>)}
          </div>
          {phase === 'idle'
            ? <button onClick={run} className={`${btn} mt-5 bg-ink text-bg`}>{t('inp.run')}</button>
            : (
              <div className="mt-5 space-y-3 text-sm">
                <div className="h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-accent-text transition-[width] duration-100" style={{ width: `${(rows / ROWS) * 100}%` }} /></div>
                <p className="font-mono text-xs">{fill(t('inp.rows'), { n: rows.toLocaleString() })}</p>
                {phase === 'done' && (
                  <>
                    <p className="text-xs text-muted">{t('inp.map')}</p>
                    <ul className="space-y-1.5">{FIELDS[src].map(([a, b], i) => <li key={a} className="rise flex flex-wrap items-center gap-2 rounded-lg bg-bg px-3 py-1.5 font-mono text-xs" style={{ animationDelay: `${i * 140}ms` }}><span className="break-all">{a}</span><span className="text-accent-text">→</span><span>{b}</span></li>)}</ul>
                    <p className="rise text-xs text-muted">{t('inp.skipped')}</p>
                    <p className="rise flex items-center gap-2 font-semibold"><Lock size={14} className="text-accent-text" />{t('inp.stored')}</p>
                  </>
                )}
              </div>
            )}
        </div>

        <div className={card}>
          <p className="font-display text-xl">{t('inp.c2')}</p>
          <label htmlFor="weeks" className="mt-4 flex items-center justify-between text-sm font-semibold">{t('inp.fresh')}<span className="font-display text-xl">{weeks}</span></label>
          <input id="weeks" type="range" min="0" max="12" value={weeks} onChange={(e) => setWeeks(+e.target.value)} className="mt-2 w-full accent-[rgb(var(--accent-text))]" />
          <p className="mt-5 text-sm font-semibold">{t('inp.range')}: <span className="font-mono">{lo}–{hi}</span></p>
          <div className="relative mt-2 h-3 rounded-full bg-ink/10"><i className="absolute top-0 h-full rounded-full bg-accent-text transition-all duration-500" style={{ left: `${((lo - 20) / 24) * 100}%`, width: `${((hi - lo) / 24) * 100}%` }} /></div>
          <p className="mt-2 text-xs text-muted">{t('inp.rangeNote')}</p>
          <p className="mb-2 mt-5 text-sm font-semibold">{t('inp.remind')}</p>
          <div className="flex flex-wrap gap-2">{Object.keys(REMIND).map((k) => <button key={k} onClick={() => setRemind(k)} aria-pressed={remind === k} className={`${btn} py-1.5 ${remind === k ? 'bg-accent text-accent-ink' : 'hover:bg-bg'}`}>{t(`inp.${k}`)}</button>)}</div>
          {due && (
            <div className="rise mt-5 flex items-start gap-3 rounded-xl border border-line bg-bg p-3 text-sm">
              <Bell size={16} className="mt-0.5 shrink-0 text-accent-text" />
              <div><p>{t('inp.nudge')}</p><button onClick={() => setWeeks(0)} className="mt-2 font-semibold text-accent-text underline underline-offset-4">{t('inp.update')}</button></div>
            </div>
          )}
        </div>

        <div className={card}>
          <p className="font-display text-xl">{t('inp.c3')}</p>
          {del === 'done' ? (
            <div className="rise mt-5 space-y-4 text-sm">
              <p className="flex items-start gap-2 font-semibold"><Check size={16} className="mt-0.5 shrink-0 text-accent-text" />{t('inp.deleted')}</p>
              <button onClick={() => setDel('none')} className="flex items-center gap-1.5 text-muted hover:text-ink"><RotateCcw size={14} />{t('inp.reset')}</button>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div><Toggle on={pers} onChange={setPers}><span className="font-semibold">{t('inp.personalise')}</span></Toggle><p className="mt-1.5 pl-14 text-xs text-muted">{t(pers ? 'inp.persOn' : 'inp.persOff')}</p></div>
              <div><Toggle on={share} onChange={setShare}><span className="font-semibold">{t('inp.share')}</span></Toggle><p className="mt-1.5 pl-14 text-xs text-muted">{t(share ? 'inp.shareOn' : 'inp.shareOff')}</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={exportJson} className={`${btn} flex items-center gap-2 hover:bg-bg`}><Download size={14} />{t('inp.export')}</button>
                {del === 'ask'
                  ? <span className="rise flex flex-wrap items-center gap-2 text-sm"><span className="font-semibold">{t('inp.delAsk')}</span><button onClick={() => setDel('done')} className={`${btn} bg-warn py-1.5 text-bg`}>{t('inp.delYes')}</button><button onClick={() => setDel('none')} className={`${btn} py-1.5`}>{t('inp.delNo')}</button></span>
                  : <button onClick={() => setDel('ask')} className={`${btn} flex items-center gap-2 hover:bg-bg`}><Trash2 size={14} />{t('inp.del')}</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
