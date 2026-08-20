import { useState } from "react"

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<string | null>
  onGoSignup: () => void
}

export default function Login({ onLogin, onGoSignup }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await onLogin(email, password)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
      className="lg-grid-2"
    >
      {/* Left panel */}
      <div
        style={{
          background: "#1C3D2E",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(255,255,255,0.04) 27px, rgba(255,255,255,0.04) 28px)",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
        }}
        className="desktop-only"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.1)" />
            <path
              d="M20 10C20 10 10 15.5 10 22.5A7 7 0 0 0 20 29a7 7 0 0 0 10-6.5C30 15.5 20 10 20 10z"
              fill="rgba(255,255,255,0.85)"
            />
            <path
              d="M15 22.5h10M20 17.5v10"
              stroke="#1C3D2E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <div
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
                fontSize: 20,
                color: "#FAF8F4",
                lineHeight: 1.1,
              }}
            >
              Health
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 300,
                fontSize: 20,
                color: "rgba(250,248,244,0.65)",
                fontStyle: "italic",
                lineHeight: 1.1,
              }}
            >
              Passport
            </div>
          </div>
        </div>
        <div>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 300,
              fontSize: 44,
              color: "#FAF8F4",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: "0 0 20px",
            }}
          >
            Your health,
            <br />
            <em
              style={{ fontStyle: "italic", color: "rgba(250,248,244,0.75)" }}
            >
              legibly recorded.
            </em>
          </h1>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              color: "rgba(250,248,244,0.55)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 360,
            }}
          >
            Track heart, glucose, and liver metrics over time. Keep your
            prescriptions secure.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Heart", "Glucose", "Liver"].map((m) => (
            <div
              key={m}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "8px 14px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: "rgba(250,248,244,0.6)",
                letterSpacing: "0.04em",
              }}
            >
              {m.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "#F6F2EA",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(28,61,46,0.05) 27px, rgba(28,61,46,0.05) 28px)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }} className="page-enter">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 40,
            }}
            className="mobile-only"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1C3D2E" />
              <path
                d="M16 7C16 7 8 12 8 18a6 6 0 0 0 8 5.7A6 6 0 0 0 24 18C24 12 16 7 16 7z"
                fill="rgba(255,255,255,0.9)"
              />
              <path
                d="M12 18h8M16 13.5v9"
                stroke="#1C3D2E"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
                fontSize: 20,
                color: "#1A1814",
              }}
            >
              Health Passport
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 30,
              color: "#1A1814",
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 15,
              color: "#9C9181",
              margin: "0 0 28px",
            }}
          >
            Sign in to your Health Passport
          </p>

          {error && (
            <div
              style={{
                background: "#FDF1EE",
                border: "1px solid #F0B9A5",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                color: "#A83618",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                required
                style={inputStyle}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 6,
                }}
              >
                <label style={labelStyle}>Password</label>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    color: "#3D8A5F",
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9C9181",
                    display: "flex",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M2 9s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="9"
                      cy="9"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...btnPrimary,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "wait" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#244E3A"
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1C3D2E")
              }
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              color: "#9C9181",
              marginTop: 24,
            }}
          >
            Don't have an account?{" "}
            <button
              onClick={onGoSignup}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#3D8A5F",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                padding: 0,
              }}
            >
              Create one
            </button>
          </p>
          <p
            style={{
              textAlign: "center",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#C5C0B5",
              marginTop: 32,
              lineHeight: 1.6,
            }}
          >
            Your data is stored privately and never shared.
          </p>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Outfit', sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: "#5C5448",
  marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid #DDD6C5",
  borderRadius: 9,
  background: "#FDFBF7",
  fontFamily: "'Outfit', sans-serif",
  fontSize: 15,
  color: "#1A1814",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 160ms ease, box-shadow 160ms ease",
}
const btnPrimary: React.CSSProperties = {
  width: "100%",
  background: "#1C3D2E",
  color: "#FAF8F4",
  border: "none",
  borderRadius: 9,
  padding: "13px",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  transition: "background 160ms ease",
  letterSpacing: "0.01em",
  marginTop: 4,
}
function focusBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#3D8A5F"
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,138,95,0.12)"
}
function blurBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#DDD6C5"
  e.currentTarget.style.boxShadow = "none"
}
