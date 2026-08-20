import { Router } from "express"
import { randomUUID } from "crypto"
import { query } from "../db.js"
import { requireAuth, type AuthRequest } from "../middleware/auth.js"

const router = Router()
const VALID_METRICS = ["heart", "glucose", "liver"] as const
type MetricType = typeof VALID_METRICS[number]

const METRIC_META: Record<MetricType, { table: string; columns: string[] }> = {
  heart: {
    table: "hp_readings_heart",
    columns: [
      "systolic",
      "diastolic",
      "heart_rate",
      "total_cholesterol",
      "hdl",
      "ldl",
      "vldl",
      "triglycerides",
    ],
  },
  glucose: {
    table: "hp_readings_glucose",
    columns: ["fasting_glucose", "postprandial_glucose", "hba1c"],
  },
  liver: {
    table: "hp_readings_liver",
    columns: ["alt", "ast", "bilirubin"],
  },
}

/**
 * Transforms a flat database row into the nested `ApiReading` object shape
 * that the frontend expects.
 * e.g., { id, date, systolic, heart_rate } => { id, date, metricType, values: { systolic, heartRate } }
 */
function dbRowToApiReading(metricType: MetricType, row: any): any {
  const { id, date, ...values } = row
  // Convert snake_case from DB to camelCase for JS/frontend
  const camelCasedValues: Record<string, number> = {}
  for (const key in values) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    if (values[key] !== null) {
      // pg returns numeric types as strings, so we parse them
      camelCasedValues[camelKey] = parseFloat(values[key])
    }
  }
  return { id, date, metricType, values: camelCasedValues }
}

// GET /api/readings/:metric
router.get("/:metric", requireAuth, async (req: AuthRequest, res) => {
  const { metric } = req.params
  if (!VALID_METRICS.includes(metric as MetricType)) {
    res.status(400).json({ error: "Invalid metric type" })
    return
  }
  const meta = METRIC_META[(metric as MetricType)]
  try {
    const result = await query(
      `SELECT id, date::text, ${meta.columns.join(", ")} FROM ${meta.table} WHERE user_id=$1 ORDER BY date ASC, created_at ASC`,
      [req.userId],
    )
    res.json(
      result.rows.map((row) => dbRowToApiReading(metric as MetricType, row)),
    )
  } catch (err: any) {
    console.error("[readings/get]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// POST /api/readings/:metric
router.post("/:metric", requireAuth, async (req: AuthRequest, res) => {
  const { metric } = req.params
  if (!VALID_METRICS.includes(metric as MetricType)) {
    res.status(400).json({ error: "Invalid metric type" })
    return
  }
  const meta = METRIC_META[(metric as MetricType)]
  const { date, values } = req.body
  if (!date || !values || typeof values !== "object") {
    res.status(400).json({ error: "date and values required" })
    return
  }

  const insertCols: string[] = []
  const insertVals: (string | number)[] = []
  let valCounter = 3 // user_id is $1, date is $2

  // Convert camelCase from frontend to snake_case for DB and filter valid columns
  for (const col of meta.columns) {
    const camelKey = col.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    if (camelKey in values) {
      const val = Number(values[camelKey])
      if (!isNaN(val)) {
        insertCols.push(col)
        insertVals.push(val)
      }
    }
  }

  if (insertCols.length === 0) {
    res.status(400).json({ error: "No valid metric values provided" })
    return
  }

  const newReadingId = randomUUID()
  const placeholders = insertCols.map((_, i) => `$${i + 4}`).join(", ") // $1=id, $2=user_id, $3=date

  try {
    const result = await query(
      `INSERT INTO ${meta.table} (id, user_id, date, ${insertCols.join(", ")}) VALUES ($1, $2, $3, ${placeholders}) RETURNING id, date::text, ${meta.columns.join(", ")}`,
      [newReadingId, req.userId, date, ...insertVals],
    )
    res
      .status(201)
      .json(dbRowToApiReading(metric as MetricType, result.rows[0]))
  } catch (err: any) {
    console.error("[readings/post]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// DELETE /api/readings/:metric/:id
router.delete("/:metric/:id", requireAuth, async (req: AuthRequest, res) => {
  const { metric, id } = req.params
  if (!VALID_METRICS.includes(metric as MetricType)) {
    res.status(400).json({ error: "Invalid metric type" })
    return
  }
  const meta = METRIC_META[(metric as MetricType)]
  try {
    const result = await query(
      `DELETE FROM ${meta.table} WHERE id=$1 AND user_id=$2 RETURNING id`,
      [id, req.userId],
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Reading not found" })
      return
    }
    res.json({ deleted: id })
  } catch (err: any) {
    console.error("[readings/delete]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
