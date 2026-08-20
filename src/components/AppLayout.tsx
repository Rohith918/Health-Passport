import { useState } from "react"
import { AppPage } from "../types"
import { StoredUser } from "../services/api"
import Sidebar from "./Sidebar"

interface AppLayoutProps {
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
  user: StoredUser
  onLogout: () => void
  children: React.ReactNode
}

export default function AppLayout({
  currentPage,
  onNavigate,
  user,
  onLogout,
  children,
}: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageTitles: Partial<Record<AppPage, string>> = {
    dashboard: "Overview",
    heart: "Heart",
    glucose: "Glucose",
    liver: "Liver",
    prescriptions: "Prescriptions",
    "design-system": "Design System",
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Mobile top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: "#1C3D2E",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="mobile-only"
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(250,248,244,0.85)",
              padding: 4,
              display: "flex",
              alignItems: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 16,
              color: "#FAF8F4",
            }}
          >
            {pageTitles[currentPage] || "Health Passport"}
          </span>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <div className="page-enter">{children}</div>
        </main>
      </div>
    </div>
  )
}
