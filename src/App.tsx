import { useState, useEffect } from "react"
import { AppPage } from "./types"
import AppLayout from "./components/AppLayout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import MetricDetail from "./pages/MetricDetail"
import Prescriptions from "./pages/Prescriptions"
import DesignSystem from "./pages/DesignSystem"
import {
  auth,
  setToken,
  setStoredUser,
  clearToken,
  getStoredUser,
  type StoredUser,
} from "./services/api"

function DbBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 300,
        background: "#1A1814",
        color: "#FAF8F4",
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 8px 32px rgba(11,29,20,0.3)",
        maxWidth: 480,
        width: "calc(100vw - 40px)",
      }}
      className="toast-enter"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="3"
          stroke="#C8830A"
          strokeWidth="1.4"
        />
        <path
          d="M8 5v4M8 11v.5"
          stroke="#C8830A"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Database not connected
        </div>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            color: "rgba(250,248,244,0.6)",
            marginTop: 1,
          }}
        >
          Set{" "}
          <code
            style={{
              fontFamily: "'DM Mono', monospace",
              background: "rgba(255,255,255,0.1)",
              padding: "1px 5px",
              borderRadius: 3,
            }}
          >
            DATABASE_URL
          </code>{" "}
          in{" "}
          <code
            style={{
              fontFamily: "'DM Mono', monospace",
              background: "rgba(255,255,255,0.1)",
              padding: "1px 5px",
              borderRadius: 3,
            }}
          >
            .env
          </code>{" "}
          and run{" "}
          <code
            style={{
              fontFamily: "'DM Mono', monospace",
              background: "rgba(255,255,255,0.1)",
              padding: "1px 5px",
              borderRadius: 3,
            }}
          >
            pnpm db:migrate
          </code>
        </div>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(250,248,244,0.5)",
          padding: 4,
          display: "flex",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 3l8 8M11 3l-8 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<AppPage>("login")
  const [user, setUser] = useState<StoredUser | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [dbWarning, setDbWarning] = useState(false)

  // Check DB connectivity once on mount
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => {
        if (!d.db) setDbWarning(true)
      })
      .catch(() => {})
  }, [])

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      // Verify the token is still valid
      auth
        .me()
        .then((u) => {
          setUser(u)
          setStoredUser(u)
          setPage("dashboard")
        })
        .catch(() => {
          clearToken()
          setUser(null)
        })
        .finally(() => setInitializing(false))
    } else {
      setInitializing(false)
    }
  }, [])

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<string | null> => {
    try {
      const res = await auth.login(email, password)
      setToken(res.token)
      setStoredUser(res.user)
      setUser(res.user)
      setPage("dashboard")
      return null
    } catch (err: any) {
      return err.message || "Login failed"
    }
  }

  const handleSignup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<string | null> => {
    try {
      const res = await auth.signup(email, password, firstName, lastName)
      setToken(res.token)
      setStoredUser(res.user)
      setUser(res.user)
      return null
    } catch (err: any) {
      return err.message || "Signup failed"
    }
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setPage("login")
  }

  if (initializing) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            color: "#9C9181",
          }}
        >
          Loading…
        </div>
      </div>
    )
  }

  if (!user) {
    if (page === "signup") {
      return (
        <Signup onSignup={handleSignup} onGoLogin={() => setPage("login")} />
      )
    }
    return <Login onLogin={handleLogin} onGoSignup={() => setPage("signup")} />
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard userName={user.firstName} onNavigate={setPage} />
      case "heart":
        return <MetricDetail metric="heart" onNavigate={setPage} />
      case "glucose":
        return <MetricDetail metric="glucose" onNavigate={setPage} />
      case "liver":
        return <MetricDetail metric="liver" onNavigate={setPage} />
      case "prescriptions":
        return <Prescriptions />
      case "design-system":
        return <DesignSystem />
      default:
        return <Dashboard userName={user.firstName} onNavigate={setPage} />
    }
  }

  return (
    <>
      <AppLayout
        currentPage={page}
        onNavigate={setPage}
        user={user}
        onLogout={handleLogout}
      >
        {renderPage()}
      </AppLayout>
      {dbWarning && <DbBanner onDismiss={() => setDbWarning(false)} />}
    </>
  )
}
