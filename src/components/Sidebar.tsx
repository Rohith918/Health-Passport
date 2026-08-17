import React from 'react'
import { AppPage } from '../types'

interface SidebarProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const navItems: Array<{ page: AppPage; label: string; icon: React.ReactNode }> = [
  {
    page: 'dashboard',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    page: 'heart',
    label: 'Heart',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 15C9 15 2 10.5 2 5.5A3.5 3.5 0 0 1 9 4.1 3.5 3.5 0 0 1 16 5.5C16 10.5 9 15 9 15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    page: 'glucose',
    label: 'Glucose',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 9h6M9 6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    page: 'liver',
    label: 'Liver',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 10C3 6 5 3 9 3c4 0 6 3 6 6s-2 6-6 6H6a3 3 0 0 1-3-5z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    page: 'prescriptions',
    label: 'Prescriptions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="1" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 5h6M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    page: 'design-system',
    label: 'Design System',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="4.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="4.5" cy="13.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.12)" />
        <path d="M16 8C16 8 8 12.4 8 18a5 5 0 0 0 8 4 5 5 0 0 0 8-4C24 12.4 16 8 16 8z" fill="rgba(255,255,255,0.9)" />
        <path d="M12 18h8M16 14v8" stroke="#1C3D2E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div>
        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, fontSize: 16, color: '#FAF8F4', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          Health
        </div>
        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 300, fontSize: 16, color: 'rgba(250,248,244,0.7)', lineHeight: 1.1, fontStyle: 'italic' }}>
          Passport
        </div>
      </div>
    </div>
  )
}

function NavItem({ item, isActive, onClick }: { item: typeof navItems[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '9px 12px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
        color: isActive ? '#FAF8F4' : 'rgba(250,248,244,0.6)',
        fontFamily: "'Outfit', system-ui, sans-serif",
        fontWeight: isActive ? 600 : 400,
        fontSize: 14,
        transition: 'all 180ms ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'
        if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(250,248,244,0.85)'
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(250,248,244,0.6)'
      }}
    >
      <span style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }}>{item.icon}</span>
      {item.label}
      {isActive && (
        <span style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#7DC09A' }} />
      )}
    </button>
  )
}

const sidebarBg = '#1C3D2E'

function SidebarContent({ currentPage, onNavigate, onClose }: { currentPage: AppPage; onNavigate: (p: AppPage) => void; onClose?: () => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: sidebarBg,
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.03) 27px, rgba(255,255,255,0.03) 28px)',
    }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(250,248,244,0.6)', cursor: 'pointer', padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(250,248,244,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 12px 8px' }}>
          Metrics
        </div>
        {navItems.slice(0, 4).map(item => (
          <NavItem
            key={item.page}
            item={item}
            isActive={currentPage === item.page}
            onClick={() => { onNavigate(item.page); onClose?.() }}
          />
        ))}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0' }} />
        <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: 'rgba(250,248,244,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 12px 8px' }}>
          Records
        </div>
        {navItems.slice(4).map(item => (
          <NavItem
            key={item.page}
            item={item}
            isActive={currentPage === item.page}
            onClick={() => { onNavigate(item.page); onClose?.() }}
          />
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7DC09A, #3D8A5F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Fraunces', Georgia, serif",
            color: '#FAF8F4', fontSize: 13, fontWeight: 600,
          }}>
            S
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: 13, color: '#FAF8F4' }}>Sarah Chen</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'rgba(250,248,244,0.45)' }}>sarah@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ currentPage, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <div style={{
        width: 248,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
        className="desktop-only"
      >
        <SidebarContent currentPage={currentPage} onNavigate={onNavigate} />
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(11,29,20,0.6)', zIndex: 40 }}
          className="fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <div
        className="sidebar-drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 280,
          height: '100%',
          zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <SidebarContent currentPage={currentPage} onNavigate={onNavigate} onClose={onMobileClose} />
      </div>
    </>
  )
}
