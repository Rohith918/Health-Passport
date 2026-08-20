import { useState } from "react"
import { MetricConfig, Reading } from "../types"

interface AddRecordModalProps {
  config: MetricConfig
  onClose: () => void
  onAdd: (reading: Omit<Reading, "id">) => void
}

export default function AddRecordModal({
  config,
  onClose,
  onAdd,
}: AddRecordModalProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [values, setValues] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed: Record<string, number> = {}
    for (const [key, val] of Object.entries(values)) {
      const n = parseFloat(val)
      if (!isNaN(n)) parsed[key] = n
    }
    onAdd({ date, metricType: config.type, values: parsed })
    onClose()
  }

  const handleValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  // Detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(11,29,20,0.55)",
    zIndex: 100,
    display: "flex",
    alignItems: isMobile ? "flex-end" : "center",
    justifyContent: "center",
    padding: isMobile ? 0 : "20px",
  }

  const panelStyle: React.CSSProperties = isMobile
    ? {
        width: "100%",
        background: "#FAF8F4",
        borderRadius: "16px 16px 0 0",
        padding: "0 0 env(safe-area-inset-bottom)",
        maxHeight: "92vh",
        overflowY: "auto",
        animationName: "sheetEnter",
        animationDuration: "280ms",
        animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }
    : {
        width: "100%",
        maxWidth: 480,
        background: "#FAF8F4",
        borderRadius: 16,
        boxShadow: "0 24px 64px rgba(11,29,20,0.24)",
        animationName: "modalEnter",
        animationDuration: "240ms",
        animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        animationFillMode: "both",
      }

  return (
    <div
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        {/* Mobile drag handle */}
        {isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "12px 0 4px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: "#DDD6C5",
              }}
            />
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #EDE8DC",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: 20,
                fontWeight: 600,
                color: "#1A1814",
              }}
            >
              Add {config.label} Record
            </h2>
            <p
              style={{
                margin: "2px 0 0",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#9C9181",
              }}
            >
              Enter your measurement values below
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9C9181",
              padding: 4,
              borderRadius: 6,
              display: "flex",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px 24px" }}>
          {/* Date field */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: "#5C5448",
                marginBottom: 6,
              }}
            >
              Date of measurement
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#EDE8DC", marginBottom: 20 }} />

          {/* Metric fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 16px",
            }}
          >
            {Object.entries(config.fields).map(([key, field]) => (
              <div
                key={key}
                style={{
                  gridColumn:
                    key === "systolic" || key === "diastolic"
                      ? "span 1"
                      : "span 1",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#5C5448",
                    marginBottom: 4,
                  }}
                >
                  {field.label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={values[key] ?? ""}
                    onChange={(e) => handleValue(key, e.target.value)}
                    step={field.step ?? 1}
                    placeholder={`${field.min}–${field.max}`}
                    style={{
                      ...inputStyle,
                      paddingRight: field.unit.length > 3 ? 52 : 44,
                      fontSize: 14,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: "#9C9181",
                      pointerEvents: "none",
                    }}
                  >
                    {field.unit}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "#B5B0A5",
                    marginTop: 2,
                  }}
                >
                  Normal: {field.min}–{field.max}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...btnSecondary, flex: 1 }}
            >
              Cancel
            </button>
            <button type="submit" style={{ ...btnPrimary, flex: 2 }}>
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #DDD6C5",
  borderRadius: 8,
  background: "#FDFAF7",
  fontFamily: "'Outfit', sans-serif",
  fontSize: 14,
  color: "#1A1814",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 160ms ease",
}

const btnPrimary: React.CSSProperties = {
  background: "#1C3D2E",
  color: "#FAF8F4",
  border: "none",
  borderRadius: 8,
  padding: "11px 20px",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  transition: "background 160ms ease",
  letterSpacing: "0.01em",
}

const btnSecondary: React.CSSProperties = {
  background: "transparent",
  color: "#5C5448",
  border: "1.5px solid #DDD6C5",
  borderRadius: 8,
  padding: "10px 20px",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 500,
  fontSize: 14,
  cursor: "pointer",
  transition: "all 160ms ease",
  letterSpacing: "0.01em",
}
