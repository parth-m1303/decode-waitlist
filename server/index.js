import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import {
  insertWaitlistEntry,
  emailExists,
  getAllWaitlistEntries,
  searchWaitlistEntries,
  getWaitlistCount,
  getStats,
  createBackup,
} from './db.js';

const app = express();
const PORT = 3001;

// ─── Config ──────────────────────────────────────────────────────────────────

// Require ADMIN_PASSWORD to be set via environment variable.
// Fail fast at startup with a clear message rather than silently using a
// hardcoded default that could be forgotten in production.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('\n❌  ADMIN_PASSWORD environment variable is not set.');
  console.error('   Copy .env.example to .env and set a secure password:');
  console.error('   cp .env.example .env');
  console.error('   Then edit .env and set:  ADMIN_PASSWORD=your-password-here\n');
  console.error('   Or run the server with the variable inline:');
  console.error('   ADMIN_PASSWORD=your-password npm run server\n');
  process.exit(1);
}

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  console.warn('\n⚠️  SESSION_SECRET environment variable is not set.');
  console.warn('   Sessions will be reset on every server restart.');
  console.warn('   Add SESSION_SECRET=your-random-string to your .env file for production.\n');
}

// ─── Middleware ───────────────────────────────────────────────────────────────
// Trust the first proxy (e.g., Render, Railway, Vercel) so that secure cookies 
// can be set even when the proxy terminates HTTPS and forwards as HTTP.
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true, 
        maxAge: 8 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax'
    }, // 8 hours
  })
);

// ─── CORS for local dev ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── Validation ───────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_DEVICE_TYPES = [
  'macOS (Apple Silicon)',
  'macOS (Intel)',
  'Windows (Interested in future support)',
];

function validateWaitlistBody(body) {
  const errors = {};
  if (!body.name || body.name.trim().length < 1) errors.name = 'Name is required.';
  if (!body.email || !EMAIL_RE.test(body.email.trim())) errors.email = 'A valid email is required.';
  if (!body.device_type || !VALID_DEVICE_TYPES.includes(body.device_type))
    errors.device_type = 'Please select a device type.';
  return errors;
}

// ─── API: Waitlist signup ─────────────────────────────────────────────────────
app.post('/api/waitlist', (req, res) => {
  const errors = validateWaitlistBody(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { name, email, device_type } = req.body;

  if (emailExists(email.trim())) {
    return res.status(409).json({
      success: false,
      errors: { email: 'You have already joined the waitlist.' },
    });
  }

  try {
    const result = insertWaitlistEntry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      device_type,
    });
    return res.status(201).json({ success: true, id: result.id });
  } catch (err) {
    // UNIQUE constraint fallback
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        success: false,
        errors: { email: 'You have already joined the waitlist.' },
      });
    }
    console.error('DB error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ─── Admin auth middleware ────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  res.redirect('/admin/login');
}

// ─── Admin: Login page ────────────────────────────────────────────────────────
app.get('/admin/login', (req, res) => {
  const error = req.query.error ? '<p class="error">Incorrect password. Try again.</p>' : '';
  res.send(loginPageHTML(error));
});

app.post('/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.authenticated = true;
    res.redirect('/admin');
  } else {
    res.redirect('/admin/login?error=1');
  }
});

// ─── Admin: Logout ────────────────────────────────────────────────────────────
app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ─── Admin: Entries JSON (for live search) ────────────────────────────────────
app.get('/admin/api/entries', requireAuth, (req, res) => {
  const q = req.query.q || '';
  const entries = q ? searchWaitlistEntries(q) : getAllWaitlistEntries();
  res.json(entries);
});

// ─── Admin: CSV export ───────────────────────────────────────────────────────
app.get('/admin/export.csv', requireAuth, (req, res) => {
  const entries = getAllWaitlistEntries();
  const headers = ['id', 'name', 'email', 'device_type', 'created_at'];
  const escape = (v) => {
    if (v == null) return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [headers.join(',')];
  for (const e of entries) {
    rows.push(headers.map((h) => escape(e[h])).join(','));
  }
  const csv = rows.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="waitlist.csv"');
  res.send(csv);
});

// ─── Admin: Manual Backup ────────────────────────────────────────────────────
app.post('/admin/backup', requireAuth, async (req, res) => {
  const result = await createBackup();
  res.json(result);
});

// ─── Admin: Main page ─────────────────────────────────────────────────────────
app.get('/admin', requireAuth, (req, res) => {
  const stats = getStats();
  const entries = getAllWaitlistEntries();
  res.send(adminPageHTML(stats, entries));
});

// Root redirect removed to allow express.static to serve the React app at '/'

// ─── Serve Static Frontend ───────────────────────────────────────────────────
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In production, serve the built Vite app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  
  // Handle client-side routing (fallback to index.html)
  // Ensure we don't interfere with API or Admin routes
  app.use((req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/admin')) {
          return next();
      }
      res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  Decode Waitlist Server running`);
  console.log(`   API:    http://localhost:${PORT}/api/waitlist`);
  console.log(`   Admin:  http://localhost:${PORT}/admin\n`);
});

// ─── HTML Templates ──────────────────────────────────────────────────────────

function loginPageHTML(errorHTML) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Decode Admin · Login</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #080808;
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      width: 100%;
      max-width: 380px;
      background: #0f0f0f;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 40px;
    }
    .logo {
      width: 44px; height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #FB923C, #F472B6);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
      font-size: 20px;
    }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .sub { color: rgba(255,255,255,0.4); font-size: 13px; margin-bottom: 28px; }
    label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
    input[type=password] {
      width: 100%;
      padding: 11px 14px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #fff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type=password]:focus { border-color: rgba(251,146,60,0.5); }
    button {
      width: 100%;
      margin-top: 16px;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #FB923C, #F472B6);
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }
    .error { color: #F87171; font-size: 13px; margin-top: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">✦</div>
    <h1>Decode Admin</h1>
    <p class="sub">Waitlist management panel</p>
    <form method="POST" action="/admin/login">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autofocus placeholder="Enter admin password" required />
      <button type="submit">Sign In →</button>
      ${errorHTML}
    </form>
  </div>
</body>
</html>`;
}

function adminPageHTML(stats, entries) {
  const count = stats.total || 0;

  const statCards = [
    { label: 'Total Signups',         value: stats.total        || 0 },
    { label: 'Apple Silicon',         value: stats.apple_silicon || 0 },
    { label: 'Intel Mac',             value: stats.intel_mac    || 0 },
    { label: 'Windows Interest',      value: stats.windows      || 0 },
  ];

  const statsHTML = statCards
    .map(
      (s) => `
    <div class="stat-card">
      <div class="stat-label">${escapeHtml(s.label)}</div>
      <div class="stat-value">${s.value}</div>
    </div>`
    )
    .join('');

  const rows = entries
    .map(
      (e) => `
    <tr data-name="${escapeAttr(e.name)}" data-email="${escapeAttr(e.email)}">
      <td class="name-cell">${escapeHtml(e.name)}</td>
      <td class="email-cell">${escapeHtml(e.email)}</td>
      <td>${deviceBadge(e.device_type)}</td>
      <td>${formatDate(e.created_at)}</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Decode Admin · Waitlist (${count} signups)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #080808; color: #fff; min-height: 100vh; padding: 32px 24px; }
    .container { max-width: 1200px; margin: 0 auto; }

    /* Header */
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #FB923C, #F472B6); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    h1 { font-size: 20px; font-weight: 700; }
    .pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; background: rgba(251,146,60,0.12); border: 1px solid rgba(251,146,60,0.2); font-size: 12px; font-weight: 600; color: #FB923C; }

    /* Actions */
    .actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
    .search-input {
      padding: 9px 14px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #fff;
      font-family: inherit;
      font-size: 13px;
      outline: none;
      width: 220px;
      transition: border-color 0.2s;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.25); }
    .search-input:focus { border-color: rgba(251,146,60,0.4); }
    .btn {
      padding: 9px 16px;
      border: none;
      border-radius: 10px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.2s;
    }
    .btn-primary { background: linear-gradient(135deg, #FB923C, #F472B6); color: #fff; }
    .btn-ghost { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); }
    .btn:hover { opacity: 0.85; }

    /* Stat cards grid */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }
    .stat-card {
      padding: 18px 20px;
      background: #0f0f0f;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
    }
    .stat-card:first-child {
      background: linear-gradient(135deg, rgba(251,146,60,0.08), rgba(244,114,182,0.08));
      border-color: rgba(251,146,60,0.15);
    }
    .stat-label {
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-bottom: 10px;
      line-height: 1.3;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #FB923C, #F472B6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Table */
    .table-wrap { background: #0f0f0f; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead th { padding: 14px 16px; text-align: left; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
    tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: rgba(255,255,255,0.02); }
    tbody td { padding: 13px 16px; font-size: 13px; color: rgba(255,255,255,0.75); }
    .name-cell { font-weight: 500; color: #fff; }
    .email-cell { color: rgba(255,255,255,0.45); font-size: 12px; }

    /* Device badges */
    .badge { display: inline-flex; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; white-space: nowrap; }
    .badge-silicon { background: rgba(52,211,153,0.12); color: #34D399; }
    .badge-intel   { background: rgba(96,165,250,0.12); color: #60A5FA; }
    .badge-win     { background: rgba(129,140,248,0.12); color: #818CF8; }

    .empty { text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.25); font-size: 14px; }
    .no-results { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="logo-icon">✦</div>
        <h1>Decode Waitlist</h1>
        <span class="pill">${count} signup${count !== 1 ? 's' : ''}</span>
      </div>
      <div class="actions">
        <input type="search" class="search-input" id="search" placeholder="Search by name or email…" />
        <button id="backup-btn" class="btn btn-ghost" onclick="createBackup()">Create Backup</button>
        <a href="/admin/export.csv" class="btn btn-primary">⬇ Export CSV</a>
        <a href="/admin/logout" class="btn btn-ghost">Sign Out</a>
      </div>
    </header>

    <div class="stats">
      ${statsHTML}
    </div>

    <div class="table-wrap">
      ${
        entries.length === 0
          ? '<div class="empty">No signups yet. Share the landing page to start collecting waitlist entries.</div>'
          : `
      <table id="entries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Device</th>
            <th>Signed Up</th>
          </tr>
        </thead>
        <tbody id="table-body">
          ${rows}
        </tbody>
      </table>
      <div class="empty no-results" id="no-results">No entries match your search.</div>
      `
      }
    </div>
  </div>

  <script>
    const searchInput = document.getElementById('search');
    const tableBody = document.getElementById('table-body');
    const noResults = document.getElementById('no-results');

    if (searchInput && tableBody) {
      searchInput.addEventListener('input', function() {
        const q = this.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll('tr');
        let visible = 0;
        rows.forEach(row => {
          const name = (row.dataset.name || '').toLowerCase();
          const email = (row.dataset.email || '').toLowerCase();
          const match = !q || name.includes(q) || email.includes(q);
          row.style.display = match ? '' : 'none';
          if (match) visible++;
        });
        if (noResults) {
          noResults.style.display = visible === 0 ? 'block' : 'none';
        }
      });
    }

    async function createBackup() {
      const btn = document.getElementById('backup-btn');
      const originalText = btn.innerText;
      btn.innerText = 'Creating...';
      btn.disabled = true;
      try {
        const res = await fetch('/admin/backup', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          btn.innerText = '✅ Backup Created';
        } else {
          btn.innerText = '❌ Failed';
        }
      } catch (err) {
        btn.innerText = '❌ Error';
      }
      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
      }, 3000);
    }
  </script>
</body>
</html>`;
}

function deviceBadge(device) {
  if (!device) return '—';
  if (device.includes('Apple Silicon')) return `<span class="badge badge-silicon">🍎 Apple Silicon</span>`;
  if (device.includes('Intel'))         return `<span class="badge badge-intel">🍎 Intel</span>`;
  if (device.includes('Windows'))       return `<span class="badge badge-win">🪟 Windows</span>`;
  return `<span class="badge">${escapeHtml(device)}</span>`;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  if (str == null) return '';
  return String(str).replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'Z'); // treat as UTC
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
