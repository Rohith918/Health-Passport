import {
  MetricConfig,
  MetricType,
  Reading,
  Prescription,
  ValueStatus,
  FieldConfig,
} from "./types"

export const METRIC_CONFIGS: Record<MetricType, MetricConfig> = {
  heart: {
    type: "heart",
    label: "Heart",
    icon: "♥",
    color: "#D9502E",
    accentColor: "#FDF1EE",
    primaryField: "heartRate",
    chartFields: ["systolic", "heartRate"],
    fields: {
      systolic: {
        label: "Systolic BP",
        unit: "mmHg",
        min: 90,
        max: 120,
        step: 1,
      },
      diastolic: {
        label: "Diastolic BP",
        unit: "mmHg",
        min: 60,
        max: 80,
        step: 1,
      },
      heartRate: {
        label: "Heart Rate",
        unit: "bpm",
        min: 60,
        max: 100,
        step: 1,
      },
      totalCholesterol: {
        label: "Total Cholesterol",
        unit: "mg/dL",
        min: 0,
        max: 200,
        step: 1,
      },
      hdl: {
        label: "HDL Cholesterol",
        unit: "mg/dL",
        min: 40,
        max: 60,
        step: 1,
      },
      ldl: {
        label: "LDL Cholesterol",
        unit: "mg/dL",
        min: 0,
        max: 100,
        step: 1,
      },
      vldl: {
        label: "VLDL Cholesterol",
        unit: "mg/dL",
        min: 2,
        max: 30,
        step: 1,
      },
      triglycerides: {
        label: "Triglycerides",
        unit: "mg/dL",
        min: 0,
        max: 150,
        step: 1,
      },
    },
  },
  glucose: {
    type: "glucose",
    label: "Glucose",
    icon: "◆",
    color: "#C8830A",
    accentColor: "#FEF7ED",
    primaryField: "fastingGlucose",
    chartFields: ["fastingGlucose", "hba1c"],
    fields: {
      fastingGlucose: {
        label: "Fasting Glucose",
        unit: "mg/dL",
        min: 70,
        max: 99,
        step: 1,
      },
      postprandialGlucose: {
        label: "Postprandial Glucose",
        unit: "mg/dL",
        min: 70,
        max: 140,
        step: 1,
      },
      hba1c: {
        label: "HbA1c",
        unit: "%",
        min: 0,
        max: 5.7,
        step: 0.1,
        decimals: 1,
      },
    },
  },
  liver: {
    type: "liver",
    label: "Liver",
    icon: "●",
    color: "#3F6DAA",
    accentColor: "#EEF2FA",
    primaryField: "alt",
    chartFields: ["alt", "ast"],
    fields: {
      alt: { label: "ALT", unit: "U/L", min: 7, max: 56, step: 1 },
      ast: { label: "AST", unit: "U/L", min: 10, max: 40, step: 1 },
      bilirubin: {
        label: "Bilirubin",
        unit: "mg/dL",
        min: 0.1,
        max: 1.2,
        step: 0.1,
        decimals: 1,
      },
    },
  },
}

export function getValueStatus(value: number, field: FieldConfig): ValueStatus {
  if (value < field.min) return "low"
  if (value > field.max) return "high"
  return "normal"
}

export function getReadingAlerts(
  reading: Reading,
): Array<{
  field: string
  label: string
  value: number
  status: ValueStatus
  unit: string
  min: number
  max: number
}> {
  const config = METRIC_CONFIGS[reading.metricType]
  const alerts: ReturnType<typeof getReadingAlerts> = []
  for (const [key, value] of Object.entries(reading.values)) {
    const field = config.fields[key]
    if (!field) continue
    const status = getValueStatus(value, field)
    if (status !== "normal") {
      alerts.push({
        field: key,
        label: field.label,
        value,
        status,
        unit: field.unit,
        min: field.min,
        max: field.max,
      })
    }
  }
  return alerts
}

export function hasAnyAlerts(reading: Reading): boolean {
  return getReadingAlerts(reading).length > 0
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
