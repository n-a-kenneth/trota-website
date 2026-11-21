'use client'

import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { fill, useVisible } from './ui'
import Section from './Section'

const SEED = [29, 30, 28, 31, 29, 30, 32, 31, 33, 31, 32, 33]
const KEEP = 24
const BUCKETS = [24, 26, 28, 30, 32, 34, 36, 38, 40]
const bucket = (v) => Math.min(40, Math.max(24, Math.floor(v / 2) * 2))
const sd = (s) => (s.n > 1 ? Math.sqrt(s.m2 / (s.n - 1)) : 0)

function add(s, v) {
  const n = s.n + 1
  const delta = v - s.mean
  const mean = s.mean + delta / n
  const m2 = s.m2 + delta * (v - mean)
  const z = s.n >= 6 && sd(s) > 0 ? (v - s.mean) / sd(s) : 0
  const data = [...s.data, v].slice(-KEEP)
  const rec = data.slice(-6)
  const rm = rec.reduce((a, b) => a + b, 0) / rec.length
  const rsd = Math.sqrt(rec.reduce((a, b) => a + (b - rm) ** 2, 0) / Math.max(1, rec.length - 1))
  const alpha = Math.min(0.6, Math.max(0.15, 0.15 + 2.5 * (rsd / rm)))
  const ewma = s.n === 0 ? v : alpha * v + (1 - alpha) * s.ewma
  const b = bucket(v)
  return {
    n, mean, m2, ewma, alpha, data,
    bins: { ...s.bins, [b]: (s.bins[b] || 0) + 1 },
    ews: [...s.ews, ewma].slice(-KEEP), fl: [...s.fl, Math.abs(z) >= 2].slice(-KEEP),
    last: { i: n, v, flag: Math.abs(z) >= 2, trend: ewma - mean > 1.5 ? 'Up' : ewma - mean < -1.5 ? 'Down' : 'Flat', b },
  }
}
const init = () => SEED.reduce(add, { n: 0, mean: 0, m2: 0, ewma: 0, alpha: 0.3, bins: {}, data: [], ews: [], fl: [], last: null })
const gen = () => {
  const noise = Math.round((Math.random() + Math.random() + Math.random() - 1.5) * 4)
  const spike = Math.random() < 0.12 ? (Math.random() < 0.5 ? 7 : -6) : 0
  return Math.min(42, Math.max(24, 31 + noise + spike))
}

function Card({ title, note, children }) {
  return <div className="rounded-2xl bg-surface p-4"><p className="font-semibold">{title}</p><p className="mt-1 text-xs text-muted">{note}</p>{children}</div>
}

export default function Tracker() {
  const { t } = useI18n()
  const [s, setS] = useState(init)
  const [paused, setPaused] = useState(false)
  const [ref, visible] = useVisible(0.25)
  useEffect(() => {
    if (!visible || paused) return
    const id = setInterval(() => setS((p) => add(p, gen())), 1900)
    return () => clearInterval(id)
  }, [visible, paused])

  const W = 640, H = 130, PW = W - 40
  const pts = s.data.slice(-16), ews = s.ews.slice(-16), fl = s.fl.slice(-16)
  const x = (i) => (i * PW) / 15
  const y = (v) => H - 8 - ((Math.min(44, Math.max(22, v)) - 22) / 22) * (H - 16)
  const half = 1.96 * sd(s) * Math.sqrt(1 + 1 / s.n)
  const lo = s.ewma - half, hi = s.ewma + half
  const maxBin = Math.max(...Object.values(s.bins))
  const L = s.last
  const msg = fill(t(L.flag ? 'trk.evFlag' : 'trk.evOk'), { i: L.i, v: L.v }) + ' ' + t(`trk.ev${L.trend}`)
  const btn = 'rounded-full border border-line px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-surface'

  return (
    <Section id="tracker" title={t('trk.title')} lead={t('trk.lead')} more="trk">
      <div ref={ref} className="space-y-4">
        <div className="rounded-2xl bg-surface p-4">
          <div className="flex items-center justify-between text-sm"><p className="font-semibold">{t('trk.pr')}</p><p className="font-mono text-xs text-muted">{t('trk.prn').replace('{n}', s.n)}</p></div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label={t('trk.pr')}>
            <polyline fill="none" stroke="rgb(var(--line))" strokeWidth="1.5" strokeDasharray="4 4" points={ews.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
            <polyline fill="none" stroke="rgb(var(--accent-text))" strokeWidth="2" strokeLinejoin="round" points={pts.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
            {pts.map((v, i) => <circle key={`${s.n}-${i}`} cx={x(i)} cy={y(v)} r={fl[i] ? 5 : 3} fill={fl[i] ? 'rgb(var(--bg))' : 'rgb(var(--accent-text))'} stroke="rgb(var(--accent-text))" strokeWidth="2" />)}
            <circle key={s.n} cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r="3" fill="none" stroke="rgb(var(--accent-text))" className="ping" />
            <line x1={x(pts.length - 1)} y1={y(pts[pts.length - 1])} x2={W - 10} y2={y(s.ewma)} stroke="rgb(var(--accent-text))" strokeDasharray="2 3" />
            <line x1={W - 10} y1={y(hi)} x2={W - 10} y2={y(lo)} stroke="rgb(var(--accent-text))" strokeWidth="8" strokeLinecap="round" opacity=".3" className="transition-all duration-700" />
            <circle cx={W - 10} cy={y(s.ewma)} r="3.5" fill="rgb(var(--accent-text))" />
          </svg>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card title={t('trk.ring')} note={t('trk.ringD')}>
            <div className="mt-3 flex flex-wrap gap-1.5">{s.data.slice(-8).map((v, i, a) => { const id = s.n - a.length + i + 1; return <span key={id} className="rise rounded bg-bg px-1.5 py-0.5 font-mono text-xs">#{id} {v}</span> })}</div>
          </Card>
          <Card title={t('trk.map')} note={t('trk.mapD')}>
            <div className="mt-3 flex h-16 items-end gap-1">{BUCKETS.map((b) => <div key={b} className={`flex-1 rounded-t transition-all duration-700 ${L.b === b ? 'bg-accent-text' : 'bg-ink/25'}`} style={{ height: `${((s.bins[b] || 0) / maxBin) * 100}%` }} />)}</div>
            <div className="mt-1 flex gap-1">{BUCKETS.map((b) => <span key={b} className="flex-1 text-center text-[10px] text-muted">{b}</span>)}</div>
          </Card>
          <Card title={t('trk.stat')} note={t('trk.statD')}>
            <p className="mt-3 font-display text-3xl">{s.mean.toFixed(1)}<span className="ml-2 text-base text-muted">± {sd(s).toFixed(1)}</span></p>
          </Card>
          <Card title={t('trk.adapt')} note={fill(t('trk.adaptD'), { a: s.alpha.toFixed(2) })}>
            <p className="mt-3 font-display text-3xl">{s.ewma.toFixed(1)}</p>
            <div className="mt-2 h-1.5 rounded bg-bg"><div className="h-full rounded bg-accent-text transition-all duration-700" style={{ width: `${(s.alpha / 0.6) * 100}%` }} /></div>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div key={s.n} className={`rise rounded-2xl border p-4 text-sm ${L.flag ? 'border-accent-text' : 'border-line'}`} aria-live="polite"><p className="mb-1 font-semibold">{t('trk.pl')}</p>{msg}</div>
          <div className="rounded-2xl border border-line p-4 text-sm"><p className="font-semibold">{t('trk.fc')}</p><p className="font-display text-2xl">{Math.round(lo)}–{Math.round(hi)} <span className="text-sm text-muted">{t('ui.days')}</span></p><p className="mt-1 max-w-[16rem] text-xs text-muted">{t('trk.fcD')}</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[['bShort', 26], ['bTyp', 31], ['bLong', 38]].map(([k, v]) => <button key={k} className={btn} onClick={() => setS((p) => add(p, v))}>{t(`trk.${k}`)} · {v}</button>)}
          <button className={`${btn} ml-auto flex items-center gap-1.5`} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}{t(paused ? 'ui.play' : 'ui.pause')}</button>
          <span className="text-xs text-muted">{t('ui.sample')}</span>
        </div>
      </div>
    </Section>
  )
}
