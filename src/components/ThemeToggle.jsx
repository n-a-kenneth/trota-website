'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useI18n } from '@/context/i18nContext'

export default function ThemeToggle() {
  const { mode, toggle } = useTheme()
  const { t } = useI18n()
  return (
    <button onClick={toggle} aria-label={t('nav.theme')} className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors hover:bg-surface">
      {mode === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
