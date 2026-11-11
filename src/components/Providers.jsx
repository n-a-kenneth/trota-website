'use client'

import { ThemeProvider } from '@/context/ThemeContext'
import { I18nProvider } from '@/context/i18nContext'
import useLenis from '@/hooks/useLenis'

export default function Providers({ children }) {
  useLenis()
  return <I18nProvider><ThemeProvider>{children}</ThemeProvider></I18nProvider>
}
