import { Router } from "express"
import multer from "multer"
import { randomUUID } from "crypto"
import { query } from "../db.js"
import { requireAuth, type AuthRequest } from "../middleware/auth.js"

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error("Only PDF, JPG, PNG files are allowed"))
  },
})

// GET /api/prescriptions
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      "SELECT id, filename, file_type, date::text, notes FROM hp_prescriptions WHERE user_id=$1 ORDER BY date DESC, created_at DESC",
      [req.userId],
    )
    res.json(
      result.rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        fileType: r.file_type,
        date: r.date,
        notes: r.notes ?? undefined,
      })),
    )
  } catch (err: any) {
    console.error("[prescriptions/get]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// POST /api/prescriptions  (multipart: file + date + notes)
router.post(
  "/",
  requireAuth,
  upload.single("file"),
  async (req: AuthRequest, res) => {
    const { date, notes } = req.body
    if (!req.file) {
      res.status(400).json({ error: "File required" })
      return
    }
    if (!date) {
      res.status(400).json({ error: "Date required" })
      return
    }

    const ext = req.file.originalname.split(".").pop()?.toLowerCase()
    const fileType =
      ext === "pdf" ? "pdf" : ext === "jpg" || ext === "jpeg" ? "jpg" : "png"
    const fileData = req.file.buffer.toString("base64")
    const newPrescriptionId = randomUUID()

    try {
      const result = await query(
        "INSERT INTO hp_prescriptions (id, user_id, filename, file_type, date, notes, file_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, filename, file_type, date::text, notes",
        [
          newPrescriptionId,
          req.userId,
          req.file.originalname,
          fileType,
          date,
          notes || null,
          fileData,
        ],
      )
      const r = result.rows[0]
      res.status(201).json({
        id: r.id,
        filename: r.filename,
        fileType: r.file_type,
        date: r.date,
        notes: r.notes ?? undefined,
      })
    } catch (err: any) {
      console.error("[prescriptions/post]", err.message)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// GET /api/prescriptions/:id/download  — returns base64 data URL
router.get("/:id/download", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      "SELECT filename, file_type, file_data FROM hp_prescriptions WHERE id=$1 AND user_id=$2",
      [req.params.id, req.userId],
    )
    const r = result.rows[0]
    if (!r) {
      res.status(404).json({ error: "Not found" })
      return
    }
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      png: "image/png",
    }
    const mime = mimeTypes[r.file_type] || "application/octet-stream"
    const buf = Buffer.from(r.file_data, "base64")
    res.setHeader("Content-Type", mime)
    res.setHeader("Content-Disposition", `inline; filename="${r.filename}"`)
    res.send(buf)
  } catch (err: any) {
    console.error("[prescriptions/download]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// DELETE /api/prescriptions/:id
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      "DELETE FROM hp_prescriptions WHERE id=$1 AND user_id=$2 RETURNING id",
      [req.params.id, req.userId],
    )
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Not found" })
      return
    }
    res.json({ deleted: req.params.id })
  } catch (err: any) {
    console.error("[prescriptions/delete]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
