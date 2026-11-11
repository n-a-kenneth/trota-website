'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const Ctx = createContext({ mode: 'light', toggle: () => {} })

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light')
  useEffect(() => { setMode(document.documentElement.classList.contains('dark') ? 'dark' : 'light') }, [])
  const toggle = () => setMode((m) => {
    const next = m === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try { localStorage.setItem('trota-mode', next) } catch {}
    return next
  })
  return <Ctx.Provider value={{ mode, toggle }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
