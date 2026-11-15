'use client'

import { useI18n } from '@/context/i18nContext'
import { useInView, More } from './ui'

export default function Section({ id, title, lead, more, children, className = '', plain = false }) {
  const { t } = useI18n()
  const [ref, seen] = useInView(0.08)
  return (
    <section id={id} ref={ref} className={`mx-auto max-w-6xl scroll-mt-28 px-5 py-14 md:py-20 ${seen ? 'in' : ''} ${className}`}>
      {title && <h2 className={`rv max-w-2xl font-display text-3xl leading-tight md:text-5xl ${lead ? 'mb-3' : 'mb-8'}`}>{title}</h2>}
      {lead && <p className="rv mb-8 max-w-2xl text-lg leading-relaxed text-muted" style={{ '--i': 1 }}>{lead}</p>}
      {plain ? children : <div className="rv" style={{ '--i': 2 }}>{children}</div>}
      {more && <More label={t('ui.more')} items={t(`${more}.more`)} />}
    </section>
  )
}
