'use client'

import { useState } from 'react'
import { CircleAlert } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { Seg } from './ui'
import Section from './Section'

const CLAIMS = { c1: { doc: 'dPaper', pub: 'pubJournal', ver: 'verPeer' }, c2: { doc: 'dJournal', pub: 'pubJournal', ver: 'verEditor' }, c3: { doc: 'dDoctor', pub: 'pubRegister', ver: 'verRegister' } }
const card = 'rounded-2xl border bg-surface p-5  md:p-7'

export default function Sources() {
  const { t } = useI18n()
  const [standard, setStandard] = useState(false)
  const [claim, setClaim] = useState('c1')
  const c = CLAIMS[claim]
  const nodes = [['trClaim', t(`src.${claim}`)], ['trPassage', t('src.passage')], ['trDoc', t(`src.${c.doc}`)], ['trPub', t(`src.${c.pub}`)], ['trVer', t(`src.${c.ver}`)], ['trWhen', t('src.when')]]
  const shown = standard ? nodes.slice(0, 1) : nodes

  return (
    <Section id="sources" title={t('src.title')} lead={t('src.lead')} more="src">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Seg value={standard} onChange={setStandard} options={[[true, t('ui.typical'), 'warn'], [false, t('ui.trota')]]} />
        <p className="font-mono text-xs text-muted">{t('src.rule')}</p>
      </div>
      <p className="mb-5 max-w-2xl text-sm text-muted"><span className="font-semibold text-ink">{t('src.lib')}:</span> {['tPaper', 'tJournal', 'tExpert', 'tDoctor'].map((k) => t(`src.${k}`)).join(' · ')}</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${card} min-h-[23.5rem] ${standard ? 'border-warn' : 'border-line'}`}>
          <p className="mb-4 ml-auto max-w-sm rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm text-accent-ink">{t('src.q')}</p>
          <ul className="space-y-2">
            {['c1', 'c2', 'c3'].map((k, i) => (
              <li key={k}>
                <button onClick={() => setClaim(k)} aria-pressed={claim === k} className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition-colors ${claim === k ? 'border-line bg-bg' : 'border-transparent hover:bg-bg'}`}>
                  <span className="flex-1">{t(`src.${k}`)}</span>
                  {standard ? <CircleAlert size={15} className="mt-0.5 shrink-0 text-warn" /> : <span className="shrink-0 rounded-md bg-accent px-1.5 py-0.5 font-mono text-xs text-accent-ink">[{i + 1}]</span>}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">{t('src.hint')}</p>
        </div>
        <div className={`${card} min-h-[27rem] ${standard ? 'border-warn' : 'border-line'}`}>
          <p className="mb-5 flex items-center justify-between font-display text-xl">{t('src.trail')}<span className="font-mono text-xs font-normal text-muted">{t('src.ex')}</span></p>
          <ol key={`${claim}-${standard}`}>
            {shown.map(([lk, val], i) => (
              <li key={lk} className="rise flex gap-4" style={{ animationDelay: `${i * 160}ms` }}>
                <span className="flex flex-col items-center"><i className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-accent-text" /><i className={`w-px flex-1 ${standard ? 'border-l border-dashed border-warn' : i < shown.length - 1 ? 'bg-ink/25' : ''}`} /></span>
                <span className="pb-3"><span className="block font-mono text-xs text-muted">{t(`src.${lk}`)}</span><span className="text-sm leading-relaxed">{val}</span></span>
              </li>
            ))}
            {standard && (
              <li className="rise flex gap-4" style={{ animationDelay: '200ms' }}>
                <i className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-warn" />
                <span className="text-sm text-warn">{t('src.none')}<span className="mt-1 block text-muted">{t('src.noneNote')}</span></span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </Section>
  )
}
