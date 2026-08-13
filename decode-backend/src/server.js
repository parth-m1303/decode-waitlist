require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");

const waitlistRoutes = require("./routes/waitlist");
const adminRoutes = require("./routes/admin");

const app = express();

const PORT = process.env.PORT || 10000;

// Path to the built Vite frontend (repo root / dist)
const DIST_DIR = path.resolve(__dirname, "../../dist");


// ==========================================
// PROXY (Render sits behind a reverse proxy;
// required for express-rate-limit to key off
// the real client IP instead of the proxy IP)
// ==========================================

app.set("trust proxy", 1);


// ==========================================
// SECURITY
// ==========================================

app.use(helmet());


// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL]
      : true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));


// ==========================================
// API HEALTH
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    name: "Decode API",
    status: "running",
  });
});


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/waitlist", waitlistRoutes);

app.use("/api/admin", adminRoutes);


// ==========================================
// API 404 (only for /api/* requests)
// ==========================================

app.all("/api/{*path}", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});


// ==========================================
// STATIC FRONTEND (Vite build output)
// ==========================================

app.use(express.static(DIST_DIR));


// ==========================================
// SPA FALLBACK (serves index.html for
// client-side routes like /features)
// ==========================================

app.get("{*path}", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});


// ==========================================
// START
// ==========================================

app.listen(PORT, () => {
  console.log(`Decode API running on port ${PORT}`);
});