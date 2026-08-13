import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
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
  INSERT INTO waitlist_entries (name, email, device_type)
  VALUES (@name, @email, @device_type)
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
    SUM(CASE WHEN device_type = 'Windows (Interested in future support)' THEN 1 ELSE 0 END) as windows
  FROM waitlist_entries
`);

// ─── Exported helpers ─────────────────────────────────────────────────────────

/**
 * Creates a safe backup of the running database into the backups directory.
 * Keeps only the 30 most recent backups.
 */
export async function createBackup() {
  const backupsDir = path.resolve(__dirname, '..', 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  // append timestamp to allow multiple backups per day if triggered manually
  const timeStr = new Date().toISOString().split('T')[1].replace(/:/g, '-').split('.')[0];
  const backupFilename = `waitlist-${dateStr}-${timeStr}.db`;
  const backupPath = path.join(backupsDir, backupFilename);

  try {
    // db.backup is the safe way to copy a SQLite DB while in use
    await db.backup(backupPath);
    console.log(`✅ Database backup created: ${backupFilename}`);

    // Prune old backups (keep last 30)
    const files = fs.readdirSync(backupsDir)
      .filter(f => f.startsWith('waitlist-') && f.endsWith('.db'))
      .map(f => ({ name: f, time: fs.statSync(path.join(backupsDir, f)).mtime.getTime() }))
      .sort((a, b) => b.time - a.time); // newest first

    if (files.length > 30) {
      const toDelete = files.slice(30);
      for (const file of toDelete) {
        fs.unlinkSync(path.join(backupsDir, file.name));
        console.log(`🗑️ Deleted old backup: ${file.name}`);
      }
    }
    return { success: true, message: `Backup created: ${backupFilename}` };
  } catch (err) {
    console.error('Backup failed:', err);
    return { success: false, message: 'Backup failed.' };
  }
}

// Automatically create a backup on startup
createBackup().catch(console.error);

/**
 * Insert a new waitlist entry.
 * Returns { success: true, id } or throws on duplicate/error.
 */
export function insertWaitlistEntry(data) {
  const { name, email, device_type } = data;
  const result = insertEntry.run({ name, email, device_type });
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
