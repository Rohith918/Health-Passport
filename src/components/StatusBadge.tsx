import { ValueStatus } from '../types'

interface StatusBadgeProps {
  status: ValueStatus
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const config = {
  normal: {
    dot: '#3D8A5F',
    bg: '#EAF4EE',
    text: '#244E3A',
    label: 'Normal',
    icon: '↑',
    iconEl: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="4" fill="#3D8A5F" />
      </svg>
    ),
  },
  low: {
    dot: '#3F6DAA',
    bg: '#EEF2FA',
    text: '#2D5490',
    label: 'Low',
    iconEl: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 7L1.5 3h7L5 7z" fill="#3F6DAA" />
      </svg>
    ),
  },
  high: {
    dot: '#D9502E',
    bg: '#FDF1EE',
    text: '#A83618',
    label: 'High',
    iconEl: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 3l3.5 4h-7L5 3z" fill="#D9502E" />
      </svg>
    ),
  },
}

export default function StatusBadge({ status, size = 'md', showLabel = true }: StatusBadgeProps) {
  const c = config[status]
  const padY = size === 'sm' ? '1px 6px' : '2px 8px'
  const fontSize = size === 'sm' ? '11px' : '12px'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: c.bg,
        color: c.text,
        borderRadius: 4,
        padding: padY,
        fontSize,
        fontFamily: "'DM Mono', monospace",
        fontWeight: 500,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {c.iconEl}
      {showLabel && c.label}
    </span>
  )
}

export function StatusDot({ status }: { status: ValueStatus }) {
  const colors = { normal: '#3D8A5F', low: '#3F6DAA', high: '#D9502E' }
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: colors[status],
        flexShrink: 0,
      }}
    />
  )
}
