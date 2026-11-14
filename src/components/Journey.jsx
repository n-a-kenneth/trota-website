'use client'

import { useState } from 'react'
import { Instagram, Facebook, Linkedin, Github, ArrowUpRight, Check } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import Section from './Section'

const Svg = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={d} /></svg>
const XIcon = (p) => <Svg {...p} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
const TikTokIcon = (p) => <Svg {...p} d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />

const SOCIALS = [
  { label: 'Instagram', Icon: Instagram, href: 'https://www.instagram.com/' },
  { label: 'TikTok', Icon: TikTokIcon, href: 'https://www.tiktok.com/' },
  { label: 'X', Icon: XIcon, href: 'https://x.com/' },
  { label: 'LinkedIn', Icon: Linkedin, href: 'https://www.linkedin.com/' },
  { label: 'Facebook', Icon: Facebook, href: 'https://www.facebook.com/' },
  { label: 'GitHub', Icon: Github, href: 'https://github.com/' },
]

export default function Journey() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const submit = (e) => { e.preventDefault(); if (email) setDone(true) }
  return (
    <Section id="journey" plain>
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        <div className="rv">
          <h2 className="font-display text-3xl leading-tight md:text-5xl">{t('journey.title')}</h2>
          <p className="mt-4 max-w-sm text-lg leading-relaxed text-muted">{t('journey.lead')}</p>
          <form onSubmit={submit} className="mt-10">
            <label htmlFor="email" className="text-sm font-semibold">{t('journey.news')}</label>
            {done
              ? <p className="rise mt-3 flex items-center gap-2 font-semibold"><Check size={18} className="text-accent-text" />{t('journey.thanks')}</p>
              : (
                <div className="mt-3 flex items-center gap-2 border-b-2 border-ink pb-2 focus-within:border-accent-text">
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('journey.placeholder')}
                    className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-muted" />
                  <button className="shrink-0 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5">{t('journey.subscribe')}</button>
                </div>
              )}
          </form>
        </div>
        <ul className="rv grid grid-cols-2 border-t border-line" style={{ '--i': 1 }}>
          {SOCIALS.map(({ label, Icon, href }, i) => (
            <li key={label} className={`border-b border-line ${i % 2 === 0 ? 'border-r' : ''}`}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-4 py-6 transition-colors hover:bg-surface">
                <Icon size={18} />
                <span className="flex-1 font-semibold">{label}</span>
                <ArrowUpRight size={16} className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
