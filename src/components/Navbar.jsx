'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import { scrollToId } from '@/hooks/useLenis'
import { useActive } from './ui'
import LangSwitch from './LangSwitch'
import ThemeToggle from './ThemeToggle'
import { Mark, Wordmark } from './Logo'

const TOP = [['about', ['about']], ['how', ['how']], ['impact', ['impact']], ['values', ['values']], ['team', ['team']], ['journey', ['journey']]]
const ALL = TOP.flatMap(([, ids]) => ids)

export default function Navbar() {
  const { t } = useI18n()
  const [menu, setMenu] = useState(false)
  const active = useActive(ALL)
  const go = (id) => { setMenu(false); scrollToId(id) }
  const on = (ids) => ids.includes(active)

  return (
    <header className="sticky top-0 z-40 border-b border-line/20 bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Trota" className="group flex items-center gap-2">
          <Mark strokeWidth={2.2} className="h-9 w-9 text-accent transition-transform duration-700 ease-out group-hover:rotate-[360deg]" />
          <Wordmark className="text-2xl" />
        </button>
        <ul className="hidden items-center gap-1 text-sm lg:flex">
          {TOP.map(([id, ids]) => (
            <li key={id}><button onClick={() => go(id)} aria-current={on(ids) || undefined} className={`rounded-full px-3 py-1.5 transition-colors ${on(ids) ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'}`}>{t(`nav.${id}`)}</button></li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <LangSwitch /><ThemeToggle />
          <button className="grid h-9 w-9 place-items-center lg:hidden" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      {menu && (
        <ul className="border-t border-line/20 bg-bg px-5 py-2 lg:hidden">
          {TOP.map(([id, ids]) => <li key={id}><button onClick={() => go(id)} className={`w-full py-3 text-left font-display text-xl ${on(ids) ? 'text-accent-text' : ''}`}>{t(`nav.${id}`)}</button></li>)}
        </ul>
      )}
    </header>
  )
}
