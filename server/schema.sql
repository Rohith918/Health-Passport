CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS hp_users (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Heart Readings
CREATE TABLE IF NOT EXISTS hp_readings_heart (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES hp_users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  systolic    INTEGER,
  diastolic   INTEGER,
  heart_rate  INTEGER,
  total_cholesterol INTEGER,
  hdl         INTEGER,
  ldl         INTEGER,
  vldl        INTEGER,
  triglycerides INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS hp_readings_heart_user_date ON hp_readings_heart (user_id, date);

-- Glucose Readings
CREATE TABLE IF NOT EXISTS hp_readings_glucose (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES hp_users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  fasting_glucose INTEGER,
  postprandial_glucose INTEGER,
  hba1c       NUMERIC(3, 1),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS hp_readings_glucose_user_date ON hp_readings_glucose (user_id, date);

-- Liver Readings
CREATE TABLE IF NOT EXISTS hp_readings_liver (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES hp_users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  alt         INTEGER,
  ast         INTEGER,
  bilirubin   NUMERIC(3, 1),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS hp_readings_liver_user_date ON hp_readings_liver (user_id, date);

-- Prescriptions
CREATE TABLE IF NOT EXISTS hp_prescriptions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES hp_users(id) ON DELETE CASCADE,
  filename    TEXT NOT NULL,
  file_type   TEXT NOT NULL CHECK (file_type IN ('pdf','jpg','png')),
  date        DATE NOT NULL,
  notes       TEXT,
  file_data   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS hp_prescriptions_user ON hp_prescriptions (user_id);