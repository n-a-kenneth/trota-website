'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import Section from './Section'

export default function Values() {
  const { t } = useI18n()
  const items = t('val.items')
  const pledges = t('val.pledges')
  const [open, setOpen] = useState(0)
  return (
    <Section id="values" title={t('val.title')} lead={t('val.lead')} plain>
      <ol className="divide-y divide-line border-y border-line">
        {items.map((v, i) => {
          const on = open === i
          return (
            <li key={v.t} className="rv" style={{ '--i': i }}>
              <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-3 py-7 text-left md:grid-cols-[5rem_1fr_auto]">
                <span className="pt-2 font-mono text-xs text-muted">0{i + 1}</span>
                <span>
                  <span className="block font-display text-2xl transition-colors group-hover:text-accent-text md:text-4xl">{v.t}</span>
                  <span className="mt-3 block max-w-2xl text-lg leading-relaxed">{v.s}</span>
                </span>
                <Plus size={22} className={`mt-2 shrink-0 text-muted transition-transform duration-300 ${on ? 'rotate-45' : ''}`} />
              </button>
              <div className={`grid transition-all duration-500 ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="max-w-2xl space-y-4 pb-9 pl-[3.25rem] leading-relaxed text-muted md:pl-[5.75rem]">{v.d.map((p) => <p key={p}>{p}</p>)}</div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="rv mt-20 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h3 className="font-display text-3xl md:text-4xl">{t('val.holdT')}</h3>
          <p className="mt-3 max-w-sm leading-relaxed text-muted">{t('val.holdD')}</p>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {pledges.map((p, i) => (
            <li key={p} className="flex gap-3 border-t border-line py-4 leading-relaxed">
              <span className="pop mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-ink" style={{ '--i': i }}><Check size={14} /></span>{p}
            </li>
          ))}
        </ul>
      </div>

      <p className="rv mt-24 max-w-4xl font-display text-4xl italic leading-[1.1] md:text-6xl">{t('val.close')}</p>
    </Section>
  )
}
