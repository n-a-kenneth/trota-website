'use client'

import { useState } from 'react'
import { Linkedin, Github } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import Section from './Section'

const TEAM = [
  { name: 'Nikesh Kenneth', role: 'lead', photo: '/images/nikesh.webp', linkedin: 'https://www.linkedin.com/in/n-a-kenneth/', github: 'https://github.com/n-a-kenneth/' },
  { name: 'Savitha Gunathilaka', role: 'member', photo: '/images/savitha.webp', linkedin: 'https://www.linkedin.com/in/savitha-gunathilaka111/', github: 'https://github.com/savitha-mg' },
  { name: 'Sayumi Seneviratne', role: 'member', photo: '/images/sayumi.webp', linkedin: 'https://www.linkedin.com/in/sayumi-seneviratne-2b2579415/', github: 'https://github.com/sayumiseneviratne' },
  { name: 'Ahamed Asri', role: 'member', photo: '/images/asri.webp', linkedin: 'https://www.linkedin.com/in/ahamedasri/', github: 'https://github.com/r-ahamedasri' },
  { name: 'Isuli Vidara Premasiri', role: 'member', photo: '/images/isuli.webp', linkedin: 'https://www.linkedin.com/in/isuli-vidara-premasiri-2b58b71b9/', github: 'https://github.com/isuli-vidara' },
]
const initials = (n) => { const w = n.split(' '); return w[0][0] + w[w.length - 1][0] }
const ext = { target: '_blank', rel: 'noopener noreferrer' }

function Photo({ m }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-surface font-display text-xl text-muted md:aspect-[4/5] md:h-auto md:w-full md:rounded-2xl md:text-4xl">
      {m.photo && !failed
        ? <img src={m.photo} alt={m.name} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        : initials(m.name)}
    </div>
  )
}

export default function Team() {
  const { t } = useI18n()
  return (
    <Section id="team" title={t('team.title')} plain>
      <ul className="divide-y divide-line border-y border-line md:grid md:grid-cols-5 md:gap-5 md:divide-y-0 md:border-0">
        {TEAM.map((m, i) => (
          <li key={m.name} className="rv group flex items-center gap-4 py-4 md:block md:py-0" style={{ '--i': i + 1 }}>
            <Photo m={m} />
            <div className="min-w-0 flex-1 md:mt-4">
              <p className="font-semibold leading-snug">{m.name}</p>
              <p className="text-sm text-muted">{m.role === 'lead' ? t('team.lead') : t('team.role')}</p>
            </div>
            <div className="flex w-[4.75rem] shrink-0 gap-1 text-muted md:mt-2 md:-ml-2 md:w-auto">
              <a href={m.linkedin} {...ext} aria-label={`${m.name} LinkedIn`} className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-surface hover:text-ink"><Linkedin size={16} /></a>
              {m.github && <a href={m.github} {...ext} aria-label={`${m.name} GitHub`} className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-surface hover:text-ink"><Github size={16} /></a>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
