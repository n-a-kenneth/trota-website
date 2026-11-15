'use client'

import { useI18n } from '@/context/i18nContext'
import { scrollToId } from '@/hooks/useLenis'
import { useActive } from './ui'
import { HOW } from './Navbar'

export default function HowNav() {
  const { t } = useI18n()
  const active = useActive(HOW)
  return (
    <div className="sticky top-16 z-30 border-b border-line/20 bg-bg/90 backdrop-blur">
      <ol className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-2 text-sm">
        <li className="mr-2 hidden shrink-0 self-center font-display italic text-muted sm:block">{t('nav.how')}</li>
        {HOW.map((id, i) => (
          <li key={id} className="shrink-0">
            <button onClick={() => scrollToId(id)} aria-current={active === id || undefined} className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${active === id ? 'bg-ink text-bg' : 'text-muted hover:text-ink'}`}>
              <span className="font-mono text-xs">{i + 1}</span>{t(`nav.${id}`)}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
