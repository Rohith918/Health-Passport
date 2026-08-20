// Base fetch wrapper — attaches JWT from localStorage to every request

const BASE = "/api"

function getToken(): string | null {
  return localStorage.getItem("hp_token")
}

export function setToken(token: string) {
  localStorage.setItem("hp_token", token)
}

export function clearToken() {
  localStorage.removeItem("hp_token")
  localStorage.removeItem("hp_user")
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem("hp_user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredUser(user: StoredUser) {
  localStorage.setItem("hp_user", JSON.stringify(user))
}

export interface StoredUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  }
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      msg = (await res.json()).error || msg
    } catch {}
    throw new ApiError(msg, res.status)
  }
  // 204 No Content
  if (res.status === 204) return undefined as T
  return res.json()
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string
  user: StoredUser
}

export const auth = {
  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<AuthResponse> {
    return request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName }),
    })
  },
  async login(email: string, password: string): Promise<AuthResponse> {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },
  async me(): Promise<StoredUser> {
    return request("/auth/me")
  },
}

// ── Readings ──────────────────────────────────────────────────────────────────

export interface ApiReading {
  id: string
  metricType: "heart" | "glucose" | "liver"
  date: string
  // The backend will transform snake_case columns to a camelCase `values` object
  // For now, we keep this flexible, but the backend will return the correct fields.
  // e.g., { systolic: 120, heartRate: 80 }
  values: Record<string, number>
}

export const readings = {
  async list(metric: string): Promise<ApiReading[]> {
    return request(`/readings/${metric}`)
  },
  async add(
    metric: string,
    date: string,
    values: Record<string, number>,
  ): Promise<ApiReading> {
    return request(`/readings/${metric}`, {
      method: "POST",
      body: JSON.stringify({ date, values }),
    })
  },
  async remove(metric: string, id: string): Promise<void> {
    return request(`/readings/${metric}/${id}`, { method: "DELETE" })
  },
}

// ── Prescriptions ─────────────────────────────────────────────────────────────

export interface ApiPrescription {
  id: string
  filename: string
  fileType: "pdf" | "jpg" | "png"
  date: string
  notes?: string
}

export const prescriptions = {
  async list(): Promise<ApiPrescription[]> {
    return request("/prescriptions")
  },
  async upload(
    file: File,
    date: string,
    notes?: string,
  ): Promise<ApiPrescription> {
    const form = new FormData()
    form.append("file", file)
    form.append("date", date)
    if (notes) form.append("notes", notes)
    return request("/prescriptions", { method: "POST", body: form })
  },
  downloadUrl(id: string): string {
    return `${BASE}/prescriptions/${id}/download?t=${getToken()}`
  },
  async remove(id: string): Promise<void> {
    return request(`/prescriptions/${id}`, { method: "DELETE" })
  },
}
