'use client'

import { LANGS, useI18n } from '@/context/i18nContext'

export default function LangSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div className="flex rounded-full border border-line p-0.5" role="group" aria-label="Language">
      {LANGS.map(([code, label]) => (
        <button key={code} onClick={() => setLang(code)} aria-pressed={lang === code}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors ${lang === code ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'}`}>
          {label}
        </button>
      ))}
    </div>
  )
}
