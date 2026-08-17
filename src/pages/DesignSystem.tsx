import { useState } from 'react'
import StatusBadge, { StatusDot } from '../components/StatusBadge'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 22, color: '#1A1814', margin: 0, letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, background: '#EDE8DC' }} />
      </div>
      {children}
    </div>
  )
}

function Swatch({ color, name, hex }: { color: string; name: string; hex: string }) {
  return (
    <div>
      <div style={{ width: '100%', height: 48, background: color, borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)', marginBottom: 6 }} />
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#1A1814' }}>{name}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181' }}>{hex}</div>
    </div>
  )
}

function InputDemo({ label, type = 'text', placeholder }: { label: string; type?: string; placeholder?: string }) {
  const [val, setVal] = useState('')
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#5C5448', marginBottom: 5 }}>
        {label}
      </label>
      <input
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: `1.5px solid ${focused ? '#3D8A5F' : '#DDD6C5'}`,
          borderRadius: 8,
          background: '#FDFBF7',
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          color: '#1A1814',
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 3px rgba(61,138,95,0.12)' : 'none',
          transition: 'all 160ms ease',
        }}
      />
    </div>
  )
}

export default function DesignSystem() {
  const [modalOpen, setModalOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = () => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  return (
    <div style={{ padding: '32px 32px 80px', maxWidth: 1200 }} className="">
      {/* Page header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Component Reference
        </div>
        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 36, color: '#1A1814', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Design System
        </h1>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#9C9181', margin: 0, maxWidth: 560 }}>
          Health Passport component library — tokens, typography, interactive states, and patterns for developer handoff.
        </p>
      </div>

      {/* Colors */}
      <Section title="Color Palette">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 16, marginBottom: 20 }}>
          <Swatch color="#1C3D2E" name="Forest 900" hex="#1C3D2E" />
          <Swatch color="#244E3A" name="Forest 800" hex="#244E3A" />
          <Swatch color="#2D6348" name="Forest 700" hex="#2D6348" />
          <Swatch color="#3D8A5F" name="Forest 500" hex="#3D8A5F" />
          <Swatch color="#7DC09A" name="Forest 300" hex="#7DC09A" />
          <Swatch color="#C5E4D0" name="Forest 100" hex="#C5E4D0" />
          <Swatch color="#EAF4EE" name="Forest 50" hex="#EAF4EE" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 16, marginBottom: 20 }}>
          <Swatch color="#F6F2EA" name="Cream 100" hex="#F6F2EA" />
          <Swatch color="#EDE8DC" name="Cream 200" hex="#EDE8DC" />
          <Swatch color="#DDD6C5" name="Cream 300" hex="#DDD6C5" />
          <Swatch color="#9C9181" name="Cream 500" hex="#9C9181" />
          <Swatch color="#5C5448" name="Cream 700" hex="#5C5448" />
          <Swatch color="#1A1814" name="Cream 900" hex="#1A1814" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 16 }}>
          <Swatch color="#D9502E" name="Terra 500" hex="#D9502E" />
          <Swatch color="#F0B9A5" name="Terra 200" hex="#F0B9A5" />
          <Swatch color="#FDF1EE" name="Terra 50" hex="#FDF1EE" />
          <Swatch color="#3F6DAA" name="Azure 500" hex="#3F6DAA" />
          <Swatch color="#A4BFE3" name="Azure 200" hex="#A4BFE3" />
          <Swatch color="#EEF2FA" name="Azure 50" hex="#EEF2FA" />
          <Swatch color="#C8830A" name="Amber 500" hex="#C8830A" />
          <Swatch color="#FEF7ED" name="Amber 50" hex="#FEF7ED" />
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { label: 'Display / Fraunces 600', style: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 36, color: '#1A1814', letterSpacing: '-0.02em' }, text: 'Health Passport' },
            { label: 'Heading / Fraunces 300 italic', style: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300, fontSize: 28, color: '#1A1814', fontStyle: 'italic' }, text: 'Your health, legibly recorded.' },
            { label: 'Section / Fraunces 600', style: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 20, color: '#1A1814' }, text: 'Metric Detail' },
            { label: 'Body / Outfit 400', style: { fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#1A1814' }, text: 'Track your heart rate, glucose, and liver function in one private place.' },
            { label: 'Small / Outfit 500', style: { fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: '#5C5448' }, text: 'Last updated 14 days ago' },
            { label: 'Data / DM Mono 400', style: { fontFamily: "'DM Mono', monospace", fontSize: 14, color: '#1A1814' }, text: '128 mg/dL · Fasting Glucose' },
            { label: 'Label / DM Mono uppercase', style: { fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#9C9181' }, text: 'NORMAL RANGE · LAST 6 MONTHS' },
          ].map(item => (
            <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, alignItems: 'baseline', borderBottom: '1px solid #EDE8DC', paddingBottom: 16 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9C9181', lineHeight: 1.5 }}>{item.label}</div>
              <div style={item.style}>{item.text}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <button style={btnPrimary}>Primary Action</button>
          <button style={{ ...btnPrimary, background: '#244E3A' }}>Hover state</button>
          <button style={{ ...btnPrimary, opacity: 0.5, cursor: 'not-allowed' }}>Disabled</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <button style={btnSecondary}>Secondary</button>
          <button style={{ ...btnSecondary, borderColor: '#3D8A5F', color: '#1C3D2E' }}>Hover state</button>
          <button style={{ ...btnSecondary, opacity: 0.5 }}>Disabled</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <button style={btnDestructive}>Delete Record</button>
          <button style={{ ...btnDestructive, background: '#A83618' }}>Hover state</button>
        </div>
      </Section>

      {/* Form inputs */}
      <Section title="Form Inputs">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          <InputDemo label="Text input" placeholder="Type here…" />
          <InputDemo label="Email input" type="email" placeholder="you@example.com" />
          <InputDemo label="Number input" type="number" placeholder="0–200" />
          <div>
            <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#5C5448', marginBottom: 5 }}>Date input</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              style={{
                width: '100%', padding: '10px 12px',
                border: '1.5px solid #DDD6C5', borderRadius: 8,
                background: '#FDFBF7', fontFamily: "'Outfit', sans-serif",
                fontSize: 14, color: '#1A1814', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 500, color: '#5C5448', marginBottom: 5 }}>File upload</label>
            <div style={{
              border: '1.5px dashed #DDD6C5', borderRadius: 8,
              padding: '14px', textAlign: 'center', cursor: 'pointer',
              background: '#FAF8F4',
            }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9C9181' }}>
                Click or drag to upload
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Status indicators */}
      <Section title="Status Indicators">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <StatusBadge status="normal" size="md" />
          <StatusBadge status="low" size="md" />
          <StatusBadge status="high" size="md" />
          <StatusBadge status="normal" size="sm" />
          <StatusBadge status="low" size="sm" />
          <StatusBadge status="high" size="sm" />
          <StatusBadge status="normal" size="sm" showLabel={false} />
          <StatusBadge status="low" size="sm" showLabel={false} />
          <StatusBadge status="high" size="sm" showLabel={false} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <StatusDot status="normal" />
          <StatusDot status="low" />
          <StatusDot status="high" />
        </div>

        {/* Alert banner */}
        <div style={{
          background: '#FDF1EE',
          border: '1px solid #F0B9A5',
          borderLeft: '4px solid #D9502E',
          borderRadius: 10,
          padding: '14px 18px',
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          marginBottom: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M8 1.5L14.5 13H1.5L8 1.5z" stroke="#D9502E" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M8 6v3M8 11v.5" stroke="#D9502E" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14, color: '#A83618' }}>Alert banner — out-of-range values detected</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#C06040', marginTop: 2 }}>Review the affected metrics and consult your healthcare provider.</div>
          </div>
        </div>

        {/* Toast */}
        <button onClick={showToast} style={btnSecondary}>
          Show toast notification
        </button>
      </Section>

      {/* Cards */}
      <Section title="Data Card & Table Row">
        {/* Card */}
        <div style={{ background: '#FAF8F4', border: '1.5px solid #EDE8DC', borderRadius: 14, padding: '24px', maxWidth: 340, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#D9502E', opacity: 0.5 }} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#FDF1EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#D9502E' }}>♥</div>
            <div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 18, color: '#1A1814' }}>Heart</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181' }}>Jul 26, 2025</div>
            </div>
            <div style={{ marginLeft: 'auto', background: '#FDF1EE', borderRadius: 6, padding: '4px 8px', fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#A83618' }}>2 alerts</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 14px' }}>
            {[{ label: 'Heart Rate', val: '88 bpm', status: 'normal' }, { label: 'LDL', val: '142 mg/dL', status: 'high' }].map(row => (
              <div key={row.label}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#9C9181', marginBottom: 2 }}>{row.label}</div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: row.status === 'high' ? '#D9502E' : '#1A1814' }}>{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table row */}
        <div style={{ background: '#FAF8F4', border: '1px solid #EDE8DC', borderRadius: 10, overflow: 'hidden', maxWidth: 600 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 80px', padding: '8px 16px', background: '#F0EDE6', borderBottom: '1px solid #EDE8DC' }}>
            {['Date', 'Heart Rate', 'LDL Cholesterol', 'Actions'].map(h => (
              <div key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9C9181', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>
          {[
            { date: 'Jul 26, 2025', hr: '88 bpm', ldl: '142 mg/dL', hrStatus: 'normal' as const, ldlStatus: 'high' as const },
            { date: 'May 26, 2025', hr: '74 bpm', ldl: '119 mg/dL', hrStatus: 'normal' as const, ldlStatus: 'high' as const },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr 80px', padding: '12px 16px', borderBottom: i === 0 ? '1px solid #EDE8DC' : 'none', alignItems: 'center' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#1A1814' }}>{row.date}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#1A1814' }}>{row.hr}</span>
                <StatusBadge status={row.hrStatus} size="sm" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#D9502E', fontWeight: 500 }}>{row.ldl}</span>
                <StatusBadge status={row.ldlStatus} size="sm" />
              </div>
              <div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C5C0B5', padding: 4 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 3.5h9M5 3.5V2.5A.5.5 0 0 1 5.5 2h3a.5.5 0 0 1 .5.5v1M4.5 3.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Empty state */}
      <Section title="Empty State">
        <div style={{ background: '#FAF8F4', border: '2px dashed #DDD6C5', borderRadius: 14, padding: '48px 24px', textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 52, height: 52, border: '2px dashed #DDD6C5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#C5C0B5', fontSize: 22 }}>+</div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 500, color: '#9C9181', margin: '0 0 4px' }}>No records yet</p>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#B5B0A5', margin: '0 0 16px' }}>Add your first reading to begin tracking</p>
          <button style={{ background: '#EAF4EE', color: '#244E3A', border: '1px solid #C5E4D0', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13 }}>
            Add first record
          </button>
        </div>
      </Section>

      {/* Modal & Sheet */}
      <Section title="Modal & Bottom Sheet">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setModalOpen(true)} style={btnSecondary}>Open modal (desktop)</button>
          <button onClick={() => setSheetOpen(true)} style={btnSecondary}>Open bottom sheet (mobile)</button>
        </div>
      </Section>

      {/* Spacing scale */}
      <Section title="Spacing Scale">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          {[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map(n => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ width: n, height: n, background: '#3D8A5F', opacity: 0.6, borderRadius: 2, margin: '0 auto 6px' }} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#9C9181' }}>{n}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(11,29,20,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{ background: '#FAF8F4', borderRadius: 16, padding: '28px 28px 24px', maxWidth: 420, width: '100%', boxShadow: '0 24px 64px rgba(11,29,20,0.24)' }}
            className="modal-enter"
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 22, color: '#1A1814', margin: '0 0 8px' }}>Modal dialog</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9C9181', margin: '0 0 24px', lineHeight: 1.6 }}>
              This is a standard modal. On mobile (&lt;1024px) it becomes a full-width bottom sheet with a drag handle and slides up from the bottom edge.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOpen(false)} style={btnSecondary}>Cancel</button>
              <button onClick={() => setModalOpen(false)} style={btnPrimary}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Sheet */}
      {sheetOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(11,29,20,0.55)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setSheetOpen(false)}
        >
          <div
            style={{ background: '#FAF8F4', borderRadius: '16px 16px 0 0', padding: '0 24px 32px', width: '100%' }}
            className="sheet-enter"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 16px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: '#DDD6C5' }} />
            </div>
            <h3 style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 20, color: '#1A1814', margin: '0 0 8px' }}>Bottom sheet</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9C9181', margin: '0 0 24px', lineHeight: 1.6 }}>
              Slides up from the bottom edge. Features a drag handle and full-width layout. Used for the Add Record form on mobile viewports.
            </p>
            <button onClick={() => setSheetOpen(false)} style={{ ...btnPrimary, width: '100%' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <div
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 200,
            background: '#1C3D2E', color: '#FAF8F4',
            borderRadius: 10, padding: '14px 18px',
            display: 'flex', gap: 10, alignItems: 'center',
            boxShadow: '0 8px 32px rgba(11,29,20,0.24)',
            maxWidth: 340,
          }}
          className="toast-enter"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="#7DC09A" strokeWidth="1.3" />
            <path d="M5 8l2.5 2.5L11 6" stroke="#7DC09A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13 }}>Record saved</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(250,248,244,0.65)', marginTop: 1 }}>Your reading has been logged.</div>
          </div>
        </div>
      )}
    </div>
  )
}

const btnPrimary: React.CSSProperties = {
  background: '#1C3D2E',
  color: '#FAF8F4',
  border: 'none',
  borderRadius: 8,
  padding: '10px 18px',
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 160ms ease',
}

const btnSecondary: React.CSSProperties = {
  background: 'transparent',
  color: '#5C5448',
  border: '1.5px solid #DDD6C5',
  borderRadius: 8,
  padding: '9px 18px',
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 500,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'all 160ms ease',
}

const btnDestructive: React.CSSProperties = {
  background: '#D9502E',
  color: '#FAF8F4',
  border: 'none',
  borderRadius: 8,
  padding: '10px 18px',
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 160ms ease',
}
