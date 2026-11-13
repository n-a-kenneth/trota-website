'use client'

import { useState } from 'react'
import { Linkedin, Github } from 'lucide-react'
import { useI18n } from '@/context/i18nContext'
import Section from './Section'

const TEAM = [
  { name: 'Nikesh Kenneth', role: 'lead', photo: '/images/nikesh.webp', linkedin: 'https://www.linkedin.com/in/n-a-kenneth/', github: 'https://github.com/n-a-kenneth/' },
  { name: 'Savitha Gunathilaka', role: 'member', photo: '/images/savitha.webp', linkedin: 'https://www.linkedin.com/in/savitha-gunathilaka111/', github: '' },
  { name: 'Sayumi Seneviratne', role: 'member', photo: '/images/sayumi.webp', linkedin: 'https://www.linkedin.com/in/sayumi-seneviratne-2b2579415/', github: 'https://github.com/sayumiseneviratne' },
  { name: 'Ahamed Asri', role: 'member', photo: '/images/asri.webp', linkedin: 'https://www.linkedin.com/in/ahamedasri/', github: 'https://github.com/r-ahamedasri' },
  { name: 'Isuli Vidara Premasiri', role: 'member', photo: '/images/isuli.webp', linkedin: 'https://www.linkedin.com/in/isuli-vidara-premasiri-2b58b71b9/', github: '' },
]
const BLOBS = ['60% 40% 55% 45% / 50% 55% 45% 50%', '45% 55% 40% 60% / 55% 45% 55% 45%', '55% 45% 60% 40% / 45% 60% 40% 55%']
const initials = (n) => { const w = n.split(' '); return w[0][0] + w[w.length - 1][0] }
function Avatar({ m, i }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="grid aspect-square w-full place-items-center overflow-hidden bg-surface font-display text-4xl text-muted" style={{ borderRadius: BLOBS[i % 3] }}>
      {m.photo && !failed ? <img src={m.photo} alt={m.name} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" /> : initials(m.name)}
    </div>
  )
}
const ext = { target: '_blank', rel: 'noopener noreferrer' }

export default function Team() {
  const { t } = useI18n()
  return (
    <Section id="team" title={t('team.title')} plain>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
        {TEAM.map((m, i) => (
          <li key={m.name} className={`rv ${i % 2 ? 'md:mt-6' : ''}`} style={{ '--i': i + 1 }}>
            <Avatar m={m} i={i} />
            <p className="mt-4 font-semibold">{m.name}</p>
            <p className="text-sm text-muted">{m.role === 'lead' ? t('team.lead') : t('team.role')}</p>
            <div className="mt-2 flex gap-3 text-muted">
              <a href={m.linkedin} {...ext} aria-label={`${m.name} LinkedIn`} className="hover:text-accent-text"><Linkedin size={16} /></a>
              {m.github && <a href={m.github} {...ext} aria-label={`${m.name} GitHub`} className="hover:text-accent-text"><Github size={16} /></a>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
