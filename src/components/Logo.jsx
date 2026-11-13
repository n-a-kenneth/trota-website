import { paths, size } from '@/lib/flowers.json'

export function Mark({ className = '', strokeWidth = 2.6, draw = false, style }) {
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} style={style} aria-hidden>
      <path className={draw ? 'draw' : undefined} pathLength={draw ? 1 : undefined} d={paths[0]} fill="none" stroke="currentColor"
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function Wordmark({ className = '', draw = false, delay = 0 }) {
  return (
    <span className={`relative inline-block font-display italic tracking-tight ${className}`}>
      Trota
      <svg className="absolute -bottom-[0.12em] left-0 h-[0.14em] w-full text-accent-text" viewBox="0 0 60 6" preserveAspectRatio="none" fill="none" aria-hidden>
        <path className={draw ? 'draw' : undefined} pathLength={draw ? 1 : undefined} d="M1 4 Q8 0 15 4 T30 4 T45 4 T59 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ animationDelay: `${delay}ms` }} />
      </svg>
    </span>
  )
}
