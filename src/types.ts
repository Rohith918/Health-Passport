export type MetricType = 'heart' | 'glucose' | 'liver'

export type ValueStatus = 'normal' | 'low' | 'high'

export interface FieldConfig {
  label: string
  unit: string
  min: number
  max: number
  step?: number
  decimals?: number
}

export interface MetricConfig {
  type: MetricType
  label: string
  icon: string
  color: string
  accentColor: string
  fields: Record<string, FieldConfig>
  primaryField: string
  chartFields: string[]
}

export interface Reading {
  id: string
  date: string
  metricType: MetricType
  values: Record<string, number>
}

export interface Prescription {
  id: string
  filename: string
  date: string
  fileType: 'pdf' | 'jpg' | 'png'
  notes?: string
}

export type AppPage =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'heart'
  | 'glucose'
  | 'liver'
  | 'prescriptions'
  | 'design-system'

export interface AppState {
  page: AppPage
  isAuthenticated: boolean
  userName: string
}
