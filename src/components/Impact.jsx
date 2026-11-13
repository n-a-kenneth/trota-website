'use client'

import { BadgeCheck, Check } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import Section from './Section'

const LINE = [29, 30, 28, 31, 29, 30, 32, 31, 33, 31, 32, 33, 34, 36, 35]
const tag = 'rounded-full border border-line px-2.5 py-1 text-xs text-muted'

function You({ t }) {
  return (
    <div className="space-y-3">
      <p className="ml-auto max-w-xs rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm text-accent-ink">{t('imp.pq')}</p>
      <p className="max-w-sm rounded-2xl rounded-bl-sm bg-surface px-4 py-3 text-sm leading-relaxed">{t('imp.pa')}</p>
      <span className={`${tag} inline-flex items-center gap-1`}><BadgeCheck size={12} />{t('imp.src2')}</span>
    </div>
  )
}
function Doc({ t }) {
  const x = (i) => (i * 260) / 14, y = (v) => 60 - ((v - 26) / 12) * 54
  return (
    <div className="rounded-xl bg-surface p-4 text-sm">
      <p className="font-semibold">{t('imp.rep')}</p>
      <svg viewBox="0 0 260 64" className="my-3 w-full"><polyline className="draw" fill="none" stroke="rgb(var(--accent-text))" strokeWidth="2" strokeLinejoin="round" points={LINE.map((v, i) => `${x(i)},${y(v)}`).join(' ')} /></svg>
      <ul className="space-y-1.5 text-muted">{['rep1', 'rep2', 'rep3', 'rep4'].map((k) => <li key={k} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-accent-text" />{t(`imp.${k}`)}</li>)}</ul>
      <p className="mt-3 text-xs text-muted">{t('ui.sample')}</p>
    </div>
  )
}
function Res({ t }) {
  const rows = [['p-7f3a', '30–34', 412], ['p-c91e', '25–29', 268], ['p-2b84', '40–44', 530]]
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl bg-surface p-3">
        <table className="w-full font-mono text-xs"><thead><tr className="text-left text-muted">{['hId', 'hAge', 'hN'].map((k) => <th key={k} className="pb-2 pr-3 font-normal">{t(`imp.${k}`)}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]} className="border-t border-line/30">{r.map((c, i) => <td key={i} className="py-1.5 pr-3">{c}</td>)}</tr>)}</tbody></table>
      </div>
      <div className="flex flex-wrap gap-2">{['tag1', 'tag2', 'tag3'].map((k) => <span key={k} className={tag}>{t(`imp.${k}`)}</span>)}</div>
      <p className="text-xs text-muted">{t('ui.sample')}</p>
    </div>
  )
}
function Ind({ t }) {
  return <ul className="space-y-2">{['k1', 'k2', 'k3', 'k4', 'k5'].map((k) => <li key={k} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-sm"><Check size={15} className="shrink-0 text-accent-text" />{t(`imp.${k}`)}</li>)}</ul>
}
const ROWS = [['you', You], ['doc', Doc], ['res', Res], ['ind', Ind]]

export default function Impact() {
  const { t } = useI18n()
  return (
    <Section id="impact" title={t('imp.title')} plain>
      <ul className="divide-y divide-line border-y border-line">
        {ROWS.map(([k, Preview], i) => (
          <li key={k} className="rv grid gap-6 py-8 md:grid-cols-2 md:gap-14" style={{ '--i': i }}>
            <div>
              <p className="font-mono text-xs text-muted">{t(`imp.${k}`)}</p>
              <h3 className="mt-3 font-display text-2xl md:text-3xl">{t(`imp.${k}H`)}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted">{t(`imp.${k}B`)}</p>
            </div>
            <Preview t={t} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
