import { MetricConfig, MetricType, Reading, Prescription, ValueStatus, FieldConfig } from './types'

export const METRIC_CONFIGS: Record<MetricType, MetricConfig> = {
  heart: {
    type: 'heart',
    label: 'Heart',
    icon: '♥',
    color: '#D9502E',
    accentColor: '#FDF1EE',
    primaryField: 'heartRate',
    chartFields: ['systolic', 'heartRate'],
    fields: {
      systolic: { label: 'Systolic BP', unit: 'mmHg', min: 90, max: 120, step: 1 },
      diastolic: { label: 'Diastolic BP', unit: 'mmHg', min: 60, max: 80, step: 1 },
      heartRate: { label: 'Heart Rate', unit: 'bpm', min: 60, max: 100, step: 1 },
      totalCholesterol: { label: 'Total Cholesterol', unit: 'mg/dL', min: 0, max: 200, step: 1 },
      hdl: { label: 'HDL Cholesterol', unit: 'mg/dL', min: 40, max: 60, step: 1 },
      ldl: { label: 'LDL Cholesterol', unit: 'mg/dL', min: 0, max: 100, step: 1 },
      vldl: { label: 'VLDL Cholesterol', unit: 'mg/dL', min: 2, max: 30, step: 1 },
      triglycerides: { label: 'Triglycerides', unit: 'mg/dL', min: 0, max: 150, step: 1 },
    },
  },
  glucose: {
    type: 'glucose',
    label: 'Glucose',
    icon: '◆',
    color: '#C8830A',
    accentColor: '#FEF7ED',
    primaryField: 'fastingGlucose',
    chartFields: ['fastingGlucose', 'hba1c'],
    fields: {
      fastingGlucose: { label: 'Fasting Glucose', unit: 'mg/dL', min: 70, max: 99, step: 1 },
      postprandialGlucose: { label: 'Postprandial Glucose', unit: 'mg/dL', min: 70, max: 140, step: 1 },
      hba1c: { label: 'HbA1c', unit: '%', min: 0, max: 5.7, step: 0.1, decimals: 1 },
    },
  },
  liver: {
    type: 'liver',
    label: 'Liver',
    icon: '●',
    color: '#3F6DAA',
    accentColor: '#EEF2FA',
    primaryField: 'alt',
    chartFields: ['alt', 'ast'],
    fields: {
      alt: { label: 'ALT', unit: 'U/L', min: 7, max: 56, step: 1 },
      ast: { label: 'AST', unit: 'U/L', min: 10, max: 40, step: 1 },
      bilirubin: { label: 'Bilirubin', unit: 'mg/dL', min: 0.1, max: 1.2, step: 0.1, decimals: 1 },
    },
  },
}

export function getValueStatus(value: number, field: FieldConfig): ValueStatus {
  if (value < field.min) return 'low'
  if (value > field.max) return 'high'
  return 'normal'
}

export function getReadingAlerts(reading: Reading): Array<{ field: string; label: string; value: number; status: ValueStatus; unit: string; min: number; max: number }> {
  const config = METRIC_CONFIGS[reading.metricType]
  const alerts: ReturnType<typeof getReadingAlerts> = []
  for (const [key, value] of Object.entries(reading.values)) {
    const field = config.fields[key]
    if (!field) continue
    const status = getValueStatus(value, field)
    if (status !== 'normal') {
      alerts.push({ field: key, label: field.label, value, status, unit: field.unit, min: field.min, max: field.max })
    }
  }
  return alerts
}

export function hasAnyAlerts(reading: Reading): boolean {
  return getReadingAlerts(reading).length > 0
}

const today = new Date()
const daysAgo = (n: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export const MOCK_READINGS: Reading[] = [
  // Heart readings
  {
    id: 'h1',
    date: daysAgo(180),
    metricType: 'heart',
    values: { systolic: 118, diastolic: 76, heartRate: 72, totalCholesterol: 188, hdl: 52, ldl: 112, vldl: 24, triglycerides: 120 },
  },
  {
    id: 'h2',
    date: daysAgo(150),
    metricType: 'heart',
    values: { systolic: 122, diastolic: 80, heartRate: 78, totalCholesterol: 195, hdl: 48, ldl: 118, vldl: 29, triglycerides: 145 },
  },
  {
    id: 'h3',
    date: daysAgo(120),
    metricType: 'heart',
    values: { systolic: 130, diastolic: 84, heartRate: 82, totalCholesterol: 210, hdl: 44, ldl: 136, vldl: 30, triglycerides: 165 },
  },
  {
    id: 'h4',
    date: daysAgo(90),
    metricType: 'heart',
    values: { systolic: 126, diastolic: 82, heartRate: 76, totalCholesterol: 204, hdl: 46, ldl: 128, vldl: 30, triglycerides: 152 },
  },
  {
    id: 'h5',
    date: daysAgo(60),
    metricType: 'heart',
    values: { systolic: 124, diastolic: 79, heartRate: 74, totalCholesterol: 197, hdl: 50, ldl: 119, vldl: 28, triglycerides: 140 },
  },
  {
    id: 'h6',
    date: daysAgo(14),
    metricType: 'heart',
    values: { systolic: 128, diastolic: 82, heartRate: 88, totalCholesterol: 215, hdl: 38, ldl: 142, vldl: 35, triglycerides: 175 },
  },
  // Glucose readings
  {
    id: 'g1',
    date: daysAgo(160),
    metricType: 'glucose',
    values: { fastingGlucose: 92, postprandialGlucose: 128, hba1c: 5.4 },
  },
  {
    id: 'g2',
    date: daysAgo(100),
    metricType: 'glucose',
    values: { fastingGlucose: 98, postprandialGlucose: 136, hba1c: 5.6 },
  },
  {
    id: 'g3',
    date: daysAgo(50),
    metricType: 'glucose',
    values: { fastingGlucose: 105, postprandialGlucose: 148, hba1c: 5.9 },
  },
  {
    id: 'g4',
    date: daysAgo(10),
    metricType: 'glucose',
    values: { fastingGlucose: 102, postprandialGlucose: 144, hba1c: 5.8 },
  },
  // Liver readings
  {
    id: 'l1',
    date: daysAgo(200),
    metricType: 'liver',
    values: { alt: 28, ast: 24, bilirubin: 0.7 },
  },
  {
    id: 'l2',
    date: daysAgo(80),
    metricType: 'liver',
    values: { alt: 35, ast: 30, bilirubin: 0.9 },
  },
  {
    id: 'l3',
    date: daysAgo(20),
    metricType: 'liver',
    values: { alt: 22, ast: 19, bilirubin: 0.6 },
  },
]

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: 'p1', filename: 'Cardiology_Report_Mar2024.pdf', date: daysAgo(180), fileType: 'pdf', notes: 'Annual cardiology review' },
  { id: 'p2', filename: 'Lab_Results_Glucose_Panel.pdf', date: daysAgo(100), fileType: 'pdf', notes: 'Metabolic panel' },
  { id: 'p3', filename: 'Lipid_Panel_Results.jpg', date: daysAgo(60), fileType: 'jpg', notes: 'Fasting lipid panel' },
  { id: 'p4', filename: 'Liver_Function_Test.pdf', date: daysAgo(20), fileType: 'pdf' },
]

export function getLatestReading(metricType: MetricType): Reading | null {
  const readings = MOCK_READINGS.filter(r => r.metricType === metricType)
  if (readings.length === 0) return null
  return readings.sort((a, b) => b.date.localeCompare(a.date))[0]
}

export function getReadingsByMetric(metricType: MetricType): Reading[] {
  return MOCK_READINGS
    .filter(r => r.metricType === metricType)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
