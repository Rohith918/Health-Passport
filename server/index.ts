import express from "express"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { migrate } from "./db.js"
import authRouter from "./routes/auth.js"
import readingsRouter from "./routes/readings.js"
import prescriptionsRouter from "./routes/prescriptions.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createApiApp() {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get("/api/health", async (_req, res) => {
    let dbOk = false
    try {
      const { query } = await import("./db.js")
      await query("SELECT 1")
      dbOk = true
    } catch {}
    res.json({ ok: true, db: dbOk, ts: new Date().toISOString() })
  })

  app.use("/api/auth", authRouter)
  app.use("/api/readings", readingsRouter)
  app.use("/api/prescriptions", prescriptionsRouter)

  return app
}

// Standalone mode: node server/index.ts
if (
  process.argv[1]?.endsWith("index.ts") ||
  process.argv[1]?.endsWith("index.js")
) {
  const port = parseInt(process.env.PORT || "5000") // Use PORT from .env
  const app = await createApiApp()
  try {
    await migrate()
  } catch (err: any) {
    console.warn(
      "[db] migration failed (DB may not be running yet):",
      err.message,
    )
  }

  // Serve the built frontend (dist/client) in standalone/production mode.
  // In dev, Vite's own middleware serves the frontend instead — this only
  // runs when index.js is executed directly (see the guard above).
  const clientDir = path.join(__dirname, "../client")
  app.use(express.static(clientDir))
  // Express-5-safe SPA fallback (app.get("*", ...) throws in Express 5).
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next()
    res.sendFile(path.join(clientDir, "index.html"))
  })

  app.listen(port, () => {
    console.log(`[api] listening on http://localhost:${port}`)
  })
}
