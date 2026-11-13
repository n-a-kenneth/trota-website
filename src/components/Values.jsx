'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import Section from './Section'

export default function Values() {
  const { t } = useI18n()
  const items = t('val.items')
  const [open, setOpen] = useState(null)
  return (
    <Section id="values" title={t('val.title')} plain>
      <ol className="divide-y divide-line/30 border-y border-line/30">
        {items.map((v, i) => {
          const on = open === i
          return (
            <li key={v.t} className="rv" style={{ '--i': i }}>
              <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-3 py-6 text-left md:grid-cols-[4rem_1fr_auto]">
                <span className="pt-1 font-mono text-xs text-muted">0{i + 1}</span>
                <span>
                  <span className="block font-display text-2xl md:text-3xl">{v.t}</span>
                  <span className="mt-2 block max-w-2xl text-lg leading-relaxed text-muted">{v.s}</span>
                </span>
                <Plus size={22} className={`mt-1 shrink-0 transition-transform duration-300 ${on ? 'rotate-45' : ''}`} />
              </button>
              <div className={`grid transition-all duration-500 ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <div className="max-w-2xl space-y-4 pb-8 pl-[3.25rem] leading-relaxed md:pl-[4.75rem]">{v.d.map((p) => <p key={p}>{p}</p>)}</div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="rv mt-14 max-w-3xl font-display text-3xl italic leading-tight md:text-5xl" style={{ '--i': items.length }}>{t('val.close')}</p>
    </Section>
  )
}
