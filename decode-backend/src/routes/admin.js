const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const supabase = require("../supabase");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});


// ==========================================
// ADMIN LOGIN (JSON API)
// ==========================================

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      success: true,
      token,
      expires_in: "8h",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      error: "Login failed.",
    });
  }
});


// ==========================================
// DASHBOARD STATS (detailed breakdown)
// ==========================================

router.get("/stats", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("waitlist_users")
      .select("device_type, primary_use_case");

    if (error) throw error;

    const total = data.length;
    const apple_silicon = data.filter(u => u.device_type === "macOS (Apple Silicon)" || u.device_type === "macos_apple_silicon").length;
    const intel_mac = data.filter(u => u.device_type === "macOS (Intel)" || u.device_type === "macos_intel").length;
    const windows = data.filter(u => u.device_type === "Windows (Interested in future support)" || u.device_type === "windows").length;
    const web_dev = data.filter(u => u.primary_use_case === "Web Development").length;
    const mobile_dev = data.filter(u => u.primary_use_case === "Mobile Development").length;
    const backend_dev = data.filter(u => u.primary_use_case === "Backend Development").length;
    const ai_ml = data.filter(u => u.primary_use_case === "AI / ML").length;
    const dsa = data.filter(u => u.primary_use_case === "DSA / Competitive Programming").length;

    return res.json({
      success: true,
      stats: {
        total,
        apple_silicon,
        intel_mac,
        windows,
        web_dev,
        mobile_dev,
        backend_dev,
        ai_ml,
        dsa,
        max_users: 200,
        remaining_slots: Math.max(0, 200 - total),
        percentage_filled: Math.min(100, Math.round((total / 200) * 100)),
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to load statistics.",
    });
  }
});


// ==========================================
// GET ALL WAITLIST USERS
// ==========================================

router.get("/waitlist", adminAuth, async (req, res) => {
  try {
    const q = req.query.q || "";

    let query = supabase
      .from("waitlist_users")
      .select("id, name, email, device_type, primary_use_case, preferred_ide, created_at")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({
      success: true,
      users: data,
      total: data.length,
    });
  } catch (error) {
    console.error("Admin waitlist error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to load waitlist.",
    });
  }
});


// ==========================================
// CSV EXPORT
// ==========================================

router.get("/export.csv", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("waitlist_users")
      .select("id, name, email, device_type, primary_use_case, preferred_ide, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const headers = ["id", "name", "email", "device_type", "primary_use_case", "preferred_ide", "created_at"];

    const escape = (v) => {
      if (v == null) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };

    const rows = [headers.join(",")];
    for (const e of data) {
      rows.push(headers.map((h) => escape(e[h])).join(","));
    }
    const csv = rows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="waitlist.csv"');
    res.send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to export CSV.",
    });
  }
});


// ==========================================
// DELETE WAITLIST USER
// ==========================================

router.delete("/waitlist/:id", adminAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID.",
      });
    }

    const { error } = await supabase
      .from("waitlist_users")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Waitlist user deleted.",
    });
  } catch (error) {
    console.error("Admin delete error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to delete user.",
    });
  }
});


// ==========================================
// ADMIN HTML LOGIN PAGE (served at /login-page)
// ==========================================

router.get("/login-page", (req, res) => {
  const error = req.query.error ? '<p class="error">Invalid credentials. Try again.</p>' : '';
  res.send(loginPageHTML(error));
});


// ==========================================
// ADMIN HTML FORM LOGIN (POST from login page)
// ==========================================

router.post("/login-form", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !email || !password ||
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.redirect("/api/admin/login-page?error=1");
    }

    const token = jwt.sign(
      { role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.redirect(`/api/admin/dashboard?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("Admin form login error:", error);
    return res.redirect("/api/admin/login-page?error=1");
  }
});


// ==========================================
// ADMIN HTML DASHBOARD
// ==========================================

router.get("/dashboard", async (req, res) => {
  // Accept token from query param (HTML form login redirect) or Authorization header
  let token = req.query.token;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.redirect("/api/admin/login-page");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.redirect("/api/admin/login-page?error=1");
    }
  } catch (err) {
    return res.redirect("/api/admin/login-page?error=1");
  }
  try {
    const { data: users, error: usersError } = await supabase
      .from("waitlist_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) throw usersError;

    const stats = {
      total: users.length,
      apple_silicon: users.filter(u => u.device_type === "macOS (Apple Silicon)" || u.device_type === "macos_apple_silicon").length,
      intel_mac: users.filter(u => u.device_type === "macOS (Intel)" || u.device_type === "macos_intel").length,
      windows: users.filter(u => u.device_type === "Windows (Interested in future support)" || u.device_type === "windows").length,
      web_dev: users.filter(u => u.primary_use_case === "Web Development").length,
      mobile_dev: users.filter(u => u.primary_use_case === "Mobile Development").length,
      backend_dev: users.filter(u => u.primary_use_case === "Backend Development").length,
      ai_ml: users.filter(u => u.primary_use_case === "AI / ML").length,
      dsa: users.filter(u => u.primary_use_case === "DSA / Competitive Programming").length,
    };

    res.send(adminPageHTML(stats, users));
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).send("Unable to load dashboard.");
  }
});


module.exports = router;


// ==========================================
// HTML TEMPLATES
// ==========================================

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
      background: #09090B;
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      width: 100%;
      max-width: 380px;
      background: #0F0F12;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 40px;
    }
    .logo {
      width: 44px; height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #F97316, #EC4899);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px;
      font-size: 20px;
    }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .sub { color: rgba(255,255,255,0.36); font-size: 13px; margin-bottom: 28px; }
    label { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
    input[type=email], input[type=password] {
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
      margin-bottom: 16px;
    }
    input:focus { border-color: rgba(249,115,22,0.5); }
    button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #F97316, #EC4899);
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
    <form method="POST" action="/api/admin/login-form" enctype="application/x-www-form-urlencoded">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" autofocus placeholder="admin@decode.app" required />
      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Enter admin password" required />
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
    { label: 'Total Signups',       value: stats.total        || 0 },
    { label: 'Apple Silicon',       value: stats.apple_silicon || 0 },
    { label: 'Intel Mac',           value: stats.intel_mac    || 0 },
    { label: 'Windows Interest',    value: stats.windows      || 0 },
    { label: 'Web Development',     value: stats.web_dev      || 0 },
    { label: 'Mobile Development',  value: stats.mobile_dev   || 0 },
    { label: 'Backend Development', value: stats.backend_dev  || 0 },
    { label: 'AI / ML',             value: stats.ai_ml        || 0 },
    { label: 'DSA / Competitive',   value: stats.dsa          || 0 },
  ];

  const statsHTML = statCards.map(s => `
    <div class="stat-card">
      <div class="stat-label">${escapeHtml(s.label)}</div>
      <div class="stat-value">${s.value}</div>
    </div>`).join('');

  const rows = entries.map(e => `
    <tr data-name="${escapeAttr(e.name)}" data-email="${escapeAttr(e.email)}">
      <td class="name-cell">${escapeHtml(e.name)}</td>
      <td class="email-cell">${escapeHtml(e.email)}</td>
      <td>${deviceBadge(e.device_type)}</td>
      <td>${escapeHtml(e.primary_use_case || '—')}</td>
      <td>${escapeHtml(e.preferred_ide || '—')}</td>
      <td>${formatDate(e.created_at)}</td>
    </tr>`).join('');

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
    body { font-family: 'Inter', sans-serif; background: #09090B; color: #fff; min-height: 100vh; padding: 32px 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #F97316, #EC4899); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
    h1 { font-size: 20px; font-weight: 700; }
    .pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.15); font-size: 12px; font-weight: 600; color: #F97316; }
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
    .search-input:focus { border-color: rgba(249,115,22,0.4); }
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
    .btn-primary { background: linear-gradient(135deg, #F97316, #EC4899); color: #fff; }
    .btn-ghost { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.1); }
    .btn:hover { opacity: 0.85; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }
    .stat-card {
      padding: 18px 20px;
      background: #0F0F12;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px;
    }
    .stat-card:first-child {
      background: linear-gradient(135deg, rgba(249,115,22,0.06), rgba(236,72,153,0.06));
      border-color: rgba(249,115,22,0.12);
    }
    .stat-label {
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-bottom: 10px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #F97316, #EC4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .table-wrap { background: #0F0F12; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead th { padding: 14px 16px; text-align: left; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
    tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: rgba(255,255,255,0.02); }
    tbody td { padding: 13px 16px; font-size: 13px; color: rgba(255,255,255,0.75); }
    .name-cell { font-weight: 500; color: #fff; }
    .email-cell { color: rgba(255,255,255,0.45); font-size: 12px; }
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
        <a href="/api/admin/export.csv" class="btn btn-primary">⬇ Export CSV</a>
        <a href="#" class="btn btn-ghost" onclick="localStorage.removeItem('decode_admin_token'); window.location.href='/api/admin/login'">Sign Out</a>
      </div>
    </header>

    <div class="stats">${statsHTML}</div>

    <div class="table-wrap">
      ${entries.length === 0
        ? '<div class="empty">No signups yet.</div>'
        : `
      <table id="entries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Device</th>
            <th>Primary Use Case</th>
            <th>Preferred IDE</th>
            <th>Signed Up</th>
          </tr>
        </thead>
        <tbody id="table-body">${rows}</tbody>
      </table>
      <div class="empty no-results" id="no-results">No entries match your search.</div>`
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
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

function deviceBadge(device) {
  if (!device) return '—';
  if (device.includes('Apple Silicon') || device === 'macos_apple_silicon') return '<span class="badge badge-silicon">🍎 Apple Silicon</span>';
  if (device.includes('Intel') || device === 'macos_intel') return '<span class="badge badge-intel">🍎 Intel</span>';
  if (device.includes('Windows') || device === 'windows') return '<span class="badge badge-win">🪟 Windows</span>';
  return '<span class="badge">' + escapeHtml(device) + '</span>';
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  if (str == null) return '';
  return String(str).replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
