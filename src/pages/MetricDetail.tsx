import { useState, useEffect, useCallback } from "react"
import { MetricType, Reading, AppPage } from "../types"
import {
  METRIC_CONFIGS,
  getReadingAlerts,
  getValueStatus,
  formatDate,
} from "../data"
import { readings as readingsApi } from "../services/api"
import StatusBadge from "../components/StatusBadge"
import RangeGauge from "../components/charts/RangeGauge"
import TrendChart from "../components/charts/TrendChart"
import AddRecordModal from "../components/AddRecordModal"

interface MetricDetailProps {
  metric: MetricType
  onNavigate: (page: AppPage) => void
}

export default function MetricDetail({
  metric,
  onNavigate,
}: MetricDetailProps) {
  const config = METRIC_CONFIGS[metric]
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await readingsApi.list(metric)
      setReadings(data)
    } catch (err: any) {
      console.error("[MetricDetail] load error", err.message)
    } finally {
      setLoading(false)
    }
  }, [metric])

  useEffect(() => {
    load()
  }, [load])

  const sorted = [...readings].sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0] ?? null
  const latestAlerts = latest ? getReadingAlerts(latest) : []

  const handleAdd = async (r: Omit<Reading, "id">) => {
    setSaving(true)
    try {
      // The API returns the newly created record, including its generated ID.
      const created = await readingsApi.add(metric, r.date, r.values)
      // Add the new record to our local state to trigger a re-render.
      setReadings((prev) => [...prev, created])
    } catch (err: any) {
      console.error("[MetricDetail] add error", err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await readingsApi.remove(metric, id)
      setReadings((prev) => prev.filter((r) => r.id !== id))
    } catch (err: any) {
      console.error("[MetricDetail] delete error", err.message)
    }
    setDeleteConfirm(null)
  }

  const chartReadings = [...readings].sort((a, b) =>
    a.date.localeCompare(b.date),
  )

  return (
    <div style={{ padding: "32px 32px 64px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <button
            onClick={() => onNavigate("dashboard")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#9C9181",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              padding: 0,
              marginBottom: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 2L4 7l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Overview
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: config.accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: config.color,
              }}
            >
              {config.icon}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 600,
                  fontSize: 30,
                  color: "#1A1814",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {config.label}
              </h1>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#9C9181",
                  marginTop: 2,
                }}
              >
                {loading
                  ? "…"
                  : `${readings.length} record${
                      readings.length !== 1 ? "s" : ""
                    }`}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={btnPrimary}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#244E3A")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1C3D2E")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Add Record
        </button>
      </div>

      {/* Alert panel */}
      {!loading && latestAlerts.length > 0 && (
        <div
          style={{
            background: "#FDF1EE",
            border: "1px solid #F0B9A5",
            borderLeft: "4px solid #D9502E",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 28,
          }}
          className="fade-in"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1.5L14.5 13H1.5L8 1.5z"
                stroke="#D9502E"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M8 6v3M8 11v.5"
                stroke="#D9502E"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#A83618",
              }}
            >
              {latestAlerts.length} value{latestAlerts.length > 1 ? "s" : ""}{" "}
              outside normal range (latest reading)
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {latestAlerts.map((a) => (
              <div
                key={a.field}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <StatusBadge status={a.status} size="sm" />
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    color: "#5C5448",
                  }}
                >
                  {a.label}:
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    fontWeight: 500,
                    color: a.status === "high" ? "#D9502E" : "#3F6DAA",
                  }}
                >
                  {a.value} {a.unit}
                </span>
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    color: "#9C9181",
                  }}
                >
                  (normal: {a.min}–{a.max} {a.unit})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}
        className="lg-grid-3"
      >
        {/* Range gauges */}
        <div
          style={{
            background: "#FAF8F4",
            border: "1px solid #EDE8DC",
            borderRadius: 14,
            padding: "22px 22px 18px",
            gridColumn: "1",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
                fontSize: 17,
                color: "#1A1814",
                margin: 0,
              }}
            >
              Latest reading
            </h2>
            {latest && (
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#9C9181",
                }}
              >
                {formatDate(latest.date)}
              </span>
            )}
          </div>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.keys(config.fields).map((k) => (
                <div
                  key={k}
                  style={{ height: 36, background: "#EDE8DC", borderRadius: 8 }}
                />
              ))}
            </div>
          ) : !latest ? (
            <EmptyState type={config.label} onAdd={() => setShowModal(true)} />
          ) : (
            <div>
              {Object.entries(config.fields).map(([key, field]) => {
                const val = latest.values[key]
                if (val == null) return null
                return (
                  <RangeGauge
                    key={key}
                    label={field.label}
                    value={val}
                    field={field}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Trend chart */}
        <div
          style={{
            background: "#FAF8F4",
            border: "1px solid #EDE8DC",
            borderRadius: 14,
            padding: "22px 22px 18px",
            gridColumn: "span 1",
          }}
          className="lg-col-span-2"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
                fontSize: 17,
                color: "#1A1814",
                margin: 0,
              }}
            >
              Trend over time
            </h2>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#D9502E",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#9C9181",
                }}
              >
                Out of range
              </span>
            </div>
          </div>
          <TrendChart readings={chartReadings} config={config} />
        </div>
      </div>

      {/* History table */}
      <div style={{ marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 17,
              color: "#1A1814",
              margin: 0,
            }}
          >
            History
          </h2>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "#9C9181",
            }}
          >
            {sorted.length} record{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div
            style={{
              background: "#FAF8F4",
              border: "1px solid #EDE8DC",
              borderRadius: 14,
              padding: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{ height: 40, background: "#EDE8DC", borderRadius: 8 }}
                />
              ))}
            </div>
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState type={config.label} onAdd={() => setShowModal(true)} />
        ) : (
          <div
            style={{
              background: "#FAF8F4",
              border: "1px solid #EDE8DC",
              borderRadius: 14,
              overflow: "hidden",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `120px repeat(${Object.keys(config.fields).length}, 1fr) 80px`,
                padding: "10px 20px",
                background: "#F0EDE6",
                borderBottom: "1px solid #EDE8DC",
                minWidth: 600,
              }}
            >
              <div style={thStyle}>Date</div>
              {Object.values(config.fields).map((f) => (
                <div key={f.label} style={thStyle}>
                  {f.label}
                </div>
              ))}
              <div style={{ ...thStyle, textAlign: "right" }}>Actions</div>
            </div>
            {sorted.map((reading, i) => {
              const rowAlerts = getReadingAlerts(reading)
              return (
                <div
                  key={reading.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `120px repeat(${Object.keys(config.fields).length}, 1fr) 80px`,
                    padding: "12px 20px",
                    borderBottom:
                      i < sorted.length - 1 ? "1px solid #EDE8DC" : "none",
                    background: i % 2 === 0 ? "#FAF8F4" : "#F7F4EE",
                    alignItems: "center",
                    minWidth: 600,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        color: "#1A1814",
                      }}
                    >
                      {formatDate(reading.date)}
                    </div>
                    {rowAlerts.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          marginTop: 4,
                          flexWrap: "wrap",
                        }}
                      >
                        {rowAlerts.map((a) => (
                          <StatusBadge
                            key={a.field}
                            status={a.status}
                            size="sm"
                            showLabel={false}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {Object.entries(config.fields).map(([key, field]) => {
                    const val = reading.values[key]
                    if (val == null)
                      return (
                        <div
                          key={key}
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 13,
                            color: "#C5C0B5",
                          }}
                        >
                          —
                        </div>
                      )
                    const status = getValueStatus(val, field)
                    const dec = field.decimals ?? 0
                    const valueColor =
                      status === "normal"
                        ? "#1A1814"
                        : status === "high"
                          ? "#D9502E"
                          : "#3F6DAA"
                    return (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 13,
                            color: valueColor,
                            fontWeight: status !== "normal" ? 500 : 400,
                          }}
                        >
                          {val.toFixed(dec)}
                        </span>
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 10,
                            color: "#9C9181",
                          }}
                        >
                          {field.unit}
                        </span>
                        {status !== "normal" && (
                          <StatusBadge
                            status={status}
                            size="sm"
                            showLabel={false}
                          />
                        )}
                      </div>
                    )
                  })}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {deleteConfirm === reading.id ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => handleDelete(reading.id)}
                          style={{
                            background: "#D9502E",
                            color: "#FAF8F4",
                            border: "none",
                            borderRadius: 6,
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12,
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={{
                            background: "none",
                            border: "1px solid #DDD6C5",
                            borderRadius: 6,
                            padding: "5px 10px",
                            cursor: "pointer",
                            color: "#9C9181",
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(reading.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#C5C0B5",
                          padding: 4,
                          display: "flex",
                          borderRadius: 6,
                          transition: "color 160ms ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#D9502E")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#C5C0B5")
                        }
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 4h10M6 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M5 4v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && (
        <AddRecordModal
          config={config}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}

function EmptyState({ type, onAdd }: { type: string onAdd: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "36px 20px" }}>
      <div
        style={{
          width: 56,
          height: 56,
          border: "2px dashed #DDD6C5",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
          color: "#C5C0B5",
          fontSize: 24,
        }}
      >
        +
      </div>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          color: "#9C9181",
          margin: "0 0 4px",
          fontWeight: 500,
        }}
      >
        No {type.toLowerCase()} records yet
      </p>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          color: "#B5B0A5",
          margin: "0 0 16px",
        }}
      >
        Add your first reading to start tracking
      </p>
      <button
        onClick={onAdd}
        style={{
          background: "#EAF4EE",
          color: "#244E3A",
          border: "1px solid #C5E4D0",
          borderRadius: 8,
          padding: "9px 18px",
          cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 500,
          fontSize: 13,
        }}
      >
        Add first record
      </button>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: 10,
  color: "#9C9181",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: 500,
}
const btnPrimary: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  background: "#1C3D2E",
  color: "#FAF8F4",
  border: "none",
  borderRadius: 9,
  padding: "10px 18px",
  fontFamily: "'Outfit', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  transition: "background 160ms ease",
  letterSpacing: "0.01em",
}
