import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.DATABASE_PATH || "./database/meetings.db";

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// Initialize schema
export function initDatabase(): void {
  const schemaPath = path.join(__dirname, "../../database/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  db.exec(schema);

  console.log("✅ Database initialized successfully");
}

// Close database connection
export function closeDatabase(): void {
  db.close();
}
