import pg from "pg"

const { Pool } = pg

let pool: pg.Pool | null = null

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        `postgresql://${process.env.PGUSER || "postgres"}:${process.env.PGPASSWORD || "postgres"}@${process.env.PGHOST || "localhost"}:${process.env.PGPORT || "5432"}/${process.env.PGDATABASE || "healthdb"}`,
      // Alternatively, you can specify individual parameters:
      // user: process.env.PGUSER || 'postgres',
      // password: process.env.PGPASSWORD || 'postgres',
      // host: process.env.PGHOST || 'localhost',
      // port: parseInt(process.env.PGPORT || '5432'),
      // database: process.env.PGDATABASE || 'healthdb',
      max: 10,
      idleTimeoutMillis: 30000,
    })
    pool.on("error", (err) => {
      console.error("[db] idle client error", err.message)
    })
  }
  return pool
}

export async function query<T extends pg.QueryResultRow = any>(
  sql: string,
  params?: any[],
): Promise<pg.QueryResult<T>> {
  return getPool().query<T>(sql, params)
}

/** Run schema migration — idempotent */
export async function migrate() {
  const { readFile } = await import("fs/promises")
  const { fileURLToPath } = await import("url")
  const { dirname, join } = await import("path")
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const sql = await readFile(join(__dirname, "schema.sql"), "utf8")
  await query(sql)
  console.log("[db] schema ready")
}
