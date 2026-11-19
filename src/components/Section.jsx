'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { useInView, useEmbedded, More } from './ui'

export default function Section({ id, title, lead, more, children, className = '', plain = false }) {
  const { t } = useI18n()
  const embedded = useEmbedded()
  const [ref, seen] = useInView(0.08)
  const [open, setOpen] = useState(false)
  if (embedded) {
    const items = more ? t(`${more}.more`) : null
    return (
      <div className="in">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          {lead && <p className="max-w-2xl leading-relaxed text-muted">{lead}</p>}
          {Array.isArray(items) && (
            <button onClick={() => setOpen(true)} className="flex shrink-0 items-center gap-2 text-sm font-semibold">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-line"><Plus size={12} /></span>{t('ui.more')}
            </button>
          )}
        </div>
        {children}
        {open && (
          <div data-lenis-prevent className="rise absolute inset-0 z-20 overflow-y-auto rounded-3xl bg-bg p-6 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <p className="font-display text-2xl md:text-3xl">{title}</p>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line hover:bg-surface"><X size={16} /></button>
            </div>
            <ul className="mt-6 max-w-3xl space-y-4 leading-relaxed text-muted">
              {items.map((x) => <li key={x} className="border-l-2 border-accent-text/60 pl-4">{x}</li>)}
            </ul>
          </div>
        )}
      </div>
    )
  }
  return (
    <section id={id} ref={ref} className={`mx-auto max-w-6xl scroll-mt-28 px-5 py-14 md:py-20 ${seen ? 'in' : ''} ${className}`}>
      {title && <h2 className={`rv max-w-2xl font-display text-3xl leading-tight md:text-5xl ${lead ? 'mb-3' : 'mb-8'}`}>{title}</h2>}
      {lead && <p className="rv mb-8 max-w-2xl text-lg leading-relaxed text-muted" style={{ '--i': 1 }}>{lead}</p>}
      {plain ? children : <div className="rv" style={{ '--i': 2 }}>{children}</div>}
      {more && <More label={t('ui.more')} items={t(`${more}.more`)} />}
    </section>
  )
}
