import { FieldConfig, ValueStatus } from '../../types'
import { getValueStatus } from '../../data'

interface RangeGaugeProps {
  label: string
  value: number
  field: FieldConfig
}

const statusColors: Record<ValueStatus, string> = {
  normal: '#3D8A5F',
  low: '#3F6DAA',
  high: '#D9502E',
}

export default function RangeGauge({ label, value, field }: RangeGaugeProps) {
  const status = getValueStatus(value, field)
  const color = statusColors[status]

  // Build the scale: show a range from 0.7*min to 1.3*max (or sensible bounds)
  const displayMin = field.min === 0 ? 0 : Math.max(0, field.min * 0.7)
  const displayMax = field.max * 1.35
  const range = displayMax - displayMin

  const normalStartPct = ((field.min - displayMin) / range) * 100
  const normalWidthPct = ((field.max - field.min) / range) * 100
  const valuePct = Math.min(100, Math.max(0, ((value - displayMin) / range) * 100))

  const dec = field.decimals ?? 0

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#5C5448', fontWeight: 500 }}>
          {label}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color, lineHeight: 1 }}>
          {value.toFixed(dec)}
          <span style={{ fontSize: 11, color: '#9C9181', marginLeft: 3 }}>{field.unit}</span>
        </span>
      </div>

      {/* Track */}
      <div style={{ position: 'relative', height: 8, background: '#EDE8DC', borderRadius: 4, overflow: 'visible' }}>
        {/* Normal range band */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${normalStartPct}%`,
          width: `${normalWidthPct}%`,
          background: 'rgba(61,138,95,0.18)',
          borderLeft: '1.5px solid rgba(61,138,95,0.4)',
          borderRight: '1.5px solid rgba(61,138,95,0.4)',
        }} />

        {/* Value marker */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${valuePct}%`,
          transform: 'translate(-50%, -50%)',
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: color,
          border: '2.5px solid #FAF8F4',
          boxShadow: `0 0 0 1.5px ${color}`,
          zIndex: 1,
          transition: 'left 400ms ease',
        }} />
      </div>

      {/* Scale labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9C9181' }}>
          {displayMin.toFixed(dec)}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(61,138,95,0.7)' }}>
          {field.min.toFixed(dec)}–{field.max.toFixed(dec)} normal
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9C9181' }}>
          {displayMax.toFixed(dec)}
        </span>
      </div>
    </div>
  )
}
