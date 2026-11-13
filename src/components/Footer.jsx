'use client'

import { useI18n } from '@/context/i18nContext'
import LangSwitch from './LangSwitch'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-display text-6xl italic tracking-tight md:text-8xl">Trota</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{t('footer.ethics')}</p>
        </div>
        <div className="flex flex-col items-start gap-4 text-sm text-muted md:items-end">
          <LangSwitch />
          <span>© {new Date().getFullYear()} Trota. {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  )
}
