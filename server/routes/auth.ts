import { Router } from "express"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import { query } from "../db.js"
import { signToken, requireAuth, type AuthRequest } from "../middleware/auth.js"

const router = Router()

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { email, firstName, lastName, password } = req.body
  if (!email || !firstName || !lastName || !password) {
    res.status(400).json({ error: "All fields required" })
    return
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" })
    return
  }
  try {
    const existing = await query("SELECT id FROM hp_users WHERE email = $1", [
      email.toLowerCase(),
    ])
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Email already in use" })
      return
    }
    const newUserId = randomUUID()
    const hash = await bcrypt.hash(password, 12)
    const result = await query(
      "INSERT INTO hp_users (id, email, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name",
      [newUserId, email.toLowerCase(), firstName, lastName, hash],
    )
    const user = result.rows[0]
    res.status(201).json({
      token: signToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    })
  } catch (err: any) {
    console.error("[auth/signup]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" })
    return
  }
  try {
    const result = await query(
      "SELECT id, email, first_name, last_name, password_hash FROM hp_users WHERE email = $1",
      [email.toLowerCase()],
    )
    const user = result.rows[0]
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }
    res.json({
      token: signToken(user.id),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    })
  } catch (err: any) {
    console.error("[auth/login]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

// GET /api/auth/me
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      "SELECT id, email, first_name, last_name FROM hp_users WHERE id = $1",
      [req.userId],
    )
    const user = result.rows[0]
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    })
  } catch (err: any) {
    console.error("[auth/me]", err.message)
    res.status(500).json({ error: "Server error" })
  }
})

export default router
