import { useState } from "react"

interface SignupProps {
  onSignup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<string | null>
  onGoLogin: () => void
}

interface PasswordStrength {
  score: number
  checks: { label: string pass: boolean }[]
}

function getPasswordStrength(pw: string): PasswordStrength {
  const checks = [
    { label: "8+ characters", pass: pw.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(pw) },
    { label: "Lowercase letter", pass: /[a-z]/.test(pw) },
    { label: "Number", pass: /\d/.test(pw) },
    { label: "Special character", pass: /[^a-zA-Z0-9]/.test(pw) },
  ]
  return { score: checks.filter((c) => c.pass).length, checks }
}

const strengthLabels = [
  "",
  "Very weak",
  "Weak",
  "Fair",
  "Strong",
  "Very strong",
]
const strengthColors = [
  "#EDE8DC",
  "#D9502E",
  "#C8830A",
  "#C8830A",
  "#3D8A5F",
  "#2D6348",
]

export default function Signup({ onSignup, onGoLogin }: SignupProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitted(true)
    // "Check your email" UX — in a real app the server sends an email
    // We also call the API to create the account
    setLoading(true)
    const err = await onSignup(email, password, firstName, lastName)
    setLoading(false)
    if (err) {
      setSubmitted(false)
      setError(err)
    }
  }

  if (submitted && !loading && !error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "#F6F2EA",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(28,61,46,0.05) 27px, rgba(28,61,46,0.05) 28px)",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: 400 }}
          className="page-enter"
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#EAF4EE",
              border: "2px solid #C5E4D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 16l5.5 5.5L24 11"
                stroke="#3D8A5F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 28,
              color: "#1A1814",
              margin: "0 0 10px",
              letterSpacing: "-0.02em",
            }}
          >
            Account created!
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 15,
              color: "#9C9181",
              lineHeight: 1.6,
              margin: "0 0 6px",
            }}
          >
            A confirmation link has been sent to
          </p>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              color: "#1C3D2E",
              margin: "0 0 28px",
              fontWeight: 500,
            }}
          >
            {email}
          </p>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              color: "#9C9181",
              lineHeight: 1.6,
              margin: "0 0 28px",
            }}
          >
            You're now signed in and ready to start tracking.
          </p>
          <button onClick={onGoLogin} style={btnPrimary}>
            Go to sign in →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "#F6F2EA",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(28,61,46,0.05) 27px, rgba(28,61,46,0.05) 28px)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }} className="page-enter">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 36,
          }}
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
              fontSize: 18,
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
          Create your account
        </h2>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            color: "#9C9181",
            margin: "0 0 28px",
          }}
        >
          Your personal health record starts here
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
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sarah"
                required
                style={inputStyle}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
            <div>
              <label style={labelStyle}>Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Chen"
                required
                style={inputStyle}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>
          </div>
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
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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
            {password.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background:
                          i <= strength.score
                            ? strengthColors[strength.score]
                            : "#EDE8DC",
                        transition: "background 240ms ease",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: strengthColors[strength.score],
                    }}
                  >
                    {strengthLabels[strength.score]}
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4px 16px",
                  }}
                >
                  {strength.checks.map((check) => (
                    <div
                      key={check.label}
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: check.pass ? "#3D8A5F" : "#C5C0B5",
                        }}
                      >
                        {check.pass ? "✓" : "○"}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 12,
                          color: check.pass ? "#3D8A5F" : "#9C9181",
                        }}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (strength.score < 3 && password.length > 0)}
            style={{
              ...btnPrimary,
              opacity:
                loading || (strength.score < 3 && password.length > 0)
                  ? 0.5
                  : 1,
              cursor: loading
                ? "wait"
                : strength.score < 3 && password.length > 0
                  ? "not-allowed"
                  : "pointer",
              marginTop: 8,
            }}
            onMouseEnter={(e) => {
              if (strength.score >= 3 && !loading)
                e.currentTarget.style.background = "#244E3A"
            }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1C3D2E")}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            color: "#9C9181",
            marginTop: 20,
          }}
        >
          Already have an account?{" "}
          <button
            onClick={onGoLogin}
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
            Sign in
          </button>
        </p>
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
  transition: "background 160ms ease, opacity 160ms ease",
  letterSpacing: "0.01em",
}
function focusBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#3D8A5F"
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,138,95,0.12)"
}
function blurBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#DDD6C5"
  e.currentTarget.style.boxShadow = "none"
}
