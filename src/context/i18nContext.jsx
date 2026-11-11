'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import en from '@/locales/en.json'
import si from '@/locales/si.json'
import ta from '@/locales/ta.json'

const dict = { en, si, ta }
export const LANGS = [['en', 'EN'], ['si', 'SI'], ['ta', 'TA']]
const Ctx = createContext(null)
const get = (d, key) => key.split('.').reduce((o, k) => o?.[k], d)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en')
  useEffect(() => {
    try { const saved = localStorage.getItem('trota-lang'); if (dict[saved]) setLang(saved) } catch {}
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('trota-lang', lang) } catch {}
  }, [lang])
  const t = (key) => get(dict[lang], key) ?? get(en, key) ?? key
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
