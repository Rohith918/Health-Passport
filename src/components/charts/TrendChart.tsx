import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Dot,
} from 'recharts'
import { MetricConfig, Reading } from '../../types'
import { formatDateShort, getValueStatus } from '../../data'

interface TrendChartProps {
  readings: Reading[]
  config: MetricConfig
}

const SERIES_COLORS = ['#1C3D2E', '#C8830A']
const OUT_OF_RANGE_COLOR = '#D9502E'

function CustomDot(props: any) {
  const { cx, cy, value, payload, dataKey, fieldMin, fieldMax, color } = props
  if (value == null || cx == null || cy == null) return null
  const isHigh = value > fieldMax
  const isLow = value < fieldMin
  const isOor = isHigh || isLow
  const fill = isOor ? OUT_OF_RANGE_COLOR : color
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={isOor ? 5 : 4}
      fill={fill}
      stroke="#FAF8F4"
      strokeWidth={2}
    />
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FAF8F4',
      border: '1px solid #DDD6C5',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(28,61,46,0.12)',
      minWidth: 160,
    }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181', marginBottom: 8 }}>
        {label}
      </div>
      {payload.map((entry: any) => {
        const isOor = entry.payload[`${entry.dataKey}_oor`]
        return (
          <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isOor ? OUT_OF_RANGE_COLOR : entry.color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#5C5448', flex: 1 }}>
              {entry.name}
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: isOor ? OUT_OF_RANGE_COLOR : '#1A1814' }}>
              {entry.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function TrendChart({ readings, config }: TrendChartProps) {
  if (readings.length < 2) {
    return (
      <div style={{
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(237,232,220,0.4)',
        borderRadius: 10,
        border: '1.5px dashed #DDD6C5',
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 10 }}>
          <rect x="4" y="28" width="4" height="6" rx="1" fill="#DDD6C5" />
          <rect x="12" y="22" width="4" height="12" rx="1" fill="#DDD6C5" />
          <rect x="20" y="18" width="4" height="16" rx="1" fill="#C5E4D0" />
          <rect x="28" y="14" width="4" height="20" rx="1" fill="#C5E4D0" />
        </svg>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9C9181', margin: 0, textAlign: 'center' }}>
          Add at least 2 records to see the trend
        </p>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#C5C0B5', margin: '4px 0 0', textAlign: 'center' }}>
          {readings.length === 1 ? '1 record so far' : '0 records so far'}
        </p>
      </div>
    )
  }

  const fields = config.chartFields.map(key => config.fields[key]).filter(Boolean)

  const data = readings.map(r => {
    const row: Record<string, any> = { date: formatDateShort(r.date) }
    config.chartFields.forEach(key => {
      const field = config.fields[key]
      if (!field) return
      const v = r.values[key]
      row[key] = v
      row[`${key}_oor`] = v != null && (v < field.min || v > field.max)
    })
    return row
  })

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,61,46,0.07)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fill: '#9C9181' }}
            axisLine={{ stroke: '#DDD6C5' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fill: '#9C9181' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {config.chartFields.length > 1 && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#5C5448', paddingTop: 8 }}
            />
          )}
          {config.chartFields.map((key, i) => {
            const field = config.fields[key]
            if (!field) return null
            const color = SERIES_COLORS[i] || '#9C9181'
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={field.label}
                stroke={color}
                strokeWidth={2}
                dot={(props: any) => (
                  <CustomDot
                    {...props}
                    fieldMin={field.min}
                    fieldMax={field.max}
                    color={color}
                  />
                )}
                activeDot={{ r: 6, stroke: '#FAF8F4', strokeWidth: 2 }}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
