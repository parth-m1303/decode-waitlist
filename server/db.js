import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, '..', 'waitlist.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist_entries (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT    NOT NULL,
    email            TEXT    NOT NULL UNIQUE,
    device_type      TEXT    NOT NULL,
    primary_use_case TEXT    NOT NULL,
    preferred_ide    TEXT,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ─── One-time migration ───────────────────────────────────────────────────────
// Remap old device_type values to the new expanded labels.
// Safe to run every startup — no-ops if values are already migrated.
db.exec(`
  UPDATE waitlist_entries
    SET device_type = 'macOS (Apple Silicon)'
  WHERE device_type = 'macOS';

  UPDATE waitlist_entries
    SET device_type = 'Windows (Interested in future support)'
  WHERE device_type = 'Windows';
`);

// ─── Prepared statements ─────────────────────────────────────────────────────
const insertEntry = db.prepare(`
  INSERT INTO waitlist_entries (name, email, device_type, primary_use_case, preferred_ide)
  VALUES (@name, @email, @device_type, @primary_use_case, @preferred_ide)
`);

const getEntryByEmail = db.prepare(`
  SELECT * FROM waitlist_entries WHERE email = ?
`);

const getAllEntries = db.prepare(`
  SELECT * FROM waitlist_entries ORDER BY id DESC
`);

const searchEntries = db.prepare(`
  SELECT * FROM waitlist_entries
  WHERE lower(email) LIKE lower(@q) OR lower(name) LIKE lower(@q)
  ORDER BY id DESC
`);

const getCount = db.prepare(`SELECT COUNT(*) as count FROM waitlist_entries`);

const getStatsQuery = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN device_type = 'macOS (Apple Silicon)' THEN 1 ELSE 0 END) as apple_silicon,
    SUM(CASE WHEN device_type = 'macOS (Intel)'         THEN 1 ELSE 0 END) as intel_mac,
    SUM(CASE WHEN device_type = 'Windows (Interested in future support)' THEN 1 ELSE 0 END) as windows,
    SUM(CASE WHEN primary_use_case = 'Web Development'              THEN 1 ELSE 0 END) as web_dev,
    SUM(CASE WHEN primary_use_case = 'Mobile Development'           THEN 1 ELSE 0 END) as mobile_dev,
    SUM(CASE WHEN primary_use_case = 'Backend Development'          THEN 1 ELSE 0 END) as backend_dev,
    SUM(CASE WHEN primary_use_case = 'AI / ML'                      THEN 1 ELSE 0 END) as ai_ml,
    SUM(CASE WHEN primary_use_case = 'DSA / Competitive Programming' THEN 1 ELSE 0 END) as dsa
  FROM waitlist_entries
`);

// ─── Exported helpers ─────────────────────────────────────────────────────────

/**
 * Insert a new waitlist entry.
 * Returns { success: true, id } or throws on duplicate/error.
 */
export function insertWaitlistEntry(data) {
  const { name, email, device_type, primary_use_case, preferred_ide } = data;
  const result = insertEntry.run({ name, email, device_type, primary_use_case, preferred_ide: preferred_ide || null });
  return { success: true, id: result.lastInsertRowid };
}

/**
 * Check if an email is already registered.
 */
export function emailExists(email) {
  return !!getEntryByEmail.get(email);
}

/**
 * Get all entries, newest first.
 */
export function getAllWaitlistEntries() {
  return getAllEntries.all();
}

/**
 * Search entries by name or email.
 */
export function searchWaitlistEntries(query) {
  return searchEntries.all({ q: `%${query}%` });
}

/**
 * Get total signup count.
 */
export function getWaitlistCount() {
  return getCount.get().count;
}

/**
 * Get aggregate stats for the admin dashboard.
 * Returns a single row with counts per device type and use case.
 */
export function getStats() {
  return getStatsQuery.get();
}

export default db;
