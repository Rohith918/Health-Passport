import { MetricType, AppPage } from '../types'
import { METRIC_CONFIGS, getLatestReading, getReadingAlerts, hasAnyAlerts, formatDate } from '../data'
import StatusBadge from '../components/StatusBadge'

interface DashboardProps {
  userName: string
  onNavigate: (page: AppPage) => void
}

const metricOrder: MetricType[] = ['heart', 'glucose', 'liver']

function MetricCard({ metric, onNavigate }: { metric: MetricType; onNavigate: (p: AppPage) => void }) {
  const config = METRIC_CONFIGS[metric]
  const latest = getLatestReading(metric)
  const alerts = latest ? getReadingAlerts(latest) : []
  const hasAlerts = alerts.length > 0

  const cardStyle: React.CSSProperties = {
    background: '#FAF8F4',
    border: hasAlerts ? `1.5px solid ${config.type === 'heart' ? '#F0B9A5' : config.type === 'glucose' ? '#F5D9A0' : '#A4BFE3'}` : '1.5px solid #EDE8DC',
    borderRadius: 14,
    padding: '24px',
    cursor: 'pointer',
    transition: 'transform 180ms ease, box-shadow 180ms ease',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div
      style={cardStyle}
      onClick={() => onNavigate(metric as AppPage)}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(28,61,46,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: config.color,
        opacity: hasAlerts ? 1 : 0.4,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: config.accentColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: config.color,
          }}>
            {config.icon}
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 18, color: '#1A1814', letterSpacing: '-0.01em' }}>
              {config.label}
            </div>
            {latest && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181', marginTop: 1 }}>
                {formatDate(latest.date)}
              </div>
            )}
          </div>
        </div>

        {/* Alert indicator */}
        {hasAlerts ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#FDF1EE', borderRadius: 6, padding: '4px 8px',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 10H1L6 1z" stroke="#D9502E" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M6 5v2.5M6 9v.5" stroke="#D9502E" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#A83618', fontWeight: 500 }}>
              {alerts.length} alert{alerts.length > 1 ? 's' : ''}
            </span>
          </div>
        ) : latest ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#EAF4EE', borderRadius: 6, padding: '4px 8px' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#244E3A', fontWeight: 500 }}>All normal</span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      {!latest ? (
        <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '2px dashed #DDD6C5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: 20, color: '#DDD6C5',
          }}>
            +
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9C9181', margin: 0 }}>
            No records yet
          </p>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#C5C0B5', margin: '4px 0 0' }}>
            Tap to add your first {config.label.toLowerCase()} reading
          </p>
        </div>
      ) : (
        <div>
          {/* Key values */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 14px', marginBottom: 14 }}>
            {Object.entries(config.fields).slice(0, 4).map(([key, field]) => {
              const val = latest.values[key]
              if (val == null) return null
              const status = val < field.min ? 'low' : val > field.max ? 'high' : 'normal'
              const dec = field.decimals ?? 0
              return (
                <div key={key}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181', marginBottom: 2 }}>
                    {field.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 18,
                      fontWeight: 500,
                      color: status !== 'normal' ? (status === 'high' ? '#D9502E' : '#3F6DAA') : '#1A1814',
                    }}>
                      {val.toFixed(dec)}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181' }}>
                      {field.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Alerts row */}
          {hasAlerts && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {alerts.slice(0, 3).map(a => (
                <StatusBadge key={a.field} status={a.status} size="sm" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Arrow */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, color: '#9C9181' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export default function Dashboard({ userName, onNavigate }: DashboardProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const anyAlerts = metricOrder.some(m => {
    const latest = getLatestReading(m)
    return latest ? hasAnyAlerts(latest) : false
  })

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div style={{ padding: '32px 32px 48px' }} className="">
      {/* Global alert banner */}
      {anyAlerts && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          background: '#FDF1EE',
          border: '1px solid #F0B9A5',
          borderLeft: '4px solid #D9502E',
          borderRadius: 10,
          padding: '14px 18px',
          marginBottom: 28,
        }}
          className="fade-in"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M9 1.5L16.5 15H1.5L9 1.5z" stroke="#D9502E" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 7v3.5M9 12.5v.5" stroke="#D9502E" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14, color: '#A83618' }}>
              Values outside normal range detected
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#C06040', marginTop: 2 }}>
              Review the metric cards below. Consult your healthcare provider if readings remain elevated.
            </div>
          </div>
        </div>
      )}

      {/* Welcome header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#9C9181', marginBottom: 6, letterSpacing: '0.04em' }}>
          {today.toUpperCase()}
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 600,
          fontSize: 36,
          color: '#1A1814',
          margin: 0,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          {greeting}, {userName}.
        </h1>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#9C9181', margin: '8px 0 0' }}>
          Here's a summary of your health metrics.
        </p>
      </div>

      {/* Metric cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 16,
      }}
        className="lg-grid-3 md-grid-2"
      >
        {metricOrder.map(metric => (
          <MetricCard key={metric} metric={metric} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Quick stats */}
      <div style={{
        marginTop: 32,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}>
        {[
          { label: 'Total records', value: '13', mono: true },
          { label: 'Last updated', value: '14d ago', mono: true },
          { label: 'Metrics tracked', value: '14 fields', mono: true },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#FAF8F4',
            border: '1px solid #EDE8DC',
            borderRadius: 10,
            padding: '14px 18px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 500, color: '#1A1814', marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9C9181' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
