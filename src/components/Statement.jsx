'use client'

import { useI18n } from '@/context/i18nContext'
import { Marked } from './ui'
import Section from './Section'

export default function Statement() {
  const { t } = useI18n()
  return (
    <Section id="what" plain>
      <p className="rv max-w-4xl font-display text-3xl leading-[1.25] md:text-5xl md:leading-[1.2]"><Marked text={t('say.text')} /></p>
    </Section>
  )
}
