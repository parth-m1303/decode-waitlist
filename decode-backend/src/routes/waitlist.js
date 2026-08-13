const express = require("express");
const rateLimit = require("express-rate-limit");
const supabase = require("../supabase");

const router = express.Router();

const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many attempts. Please try again later.",
  },
});

// ==========================================
// VALID OPTIONS
// ==========================================

const VALID_DEVICE_TYPES = [
  "macOS (Apple Silicon)",
  "macOS (Intel)",
  "Windows (Interested in future support)",
  // Legacy lowercase values from older frontend versions
  "macos_apple_silicon",
  "macos_intel",
  "windows",
];

const VALID_USE_CASES = [
  "Student Learning",
  "DSA / Competitive Programming",
  "Web Development",
  "Mobile Development",
  "Backend Development",
  "AI / ML",
  "Blockchain",
  "Other",
];


// ==========================================
// POST /api/waitlist — Join the waitlist
// ==========================================

router.post("/", waitlistLimiter, async (req, res) => {
  try {
    let { name, email, device_type, primary_use_case, preferred_ide } = req.body;

    // -------------------------
    // Basic validation
    // -------------------------

    if (!name || !email || !device_type) {
      return res.status(400).json({
        success: false,
        errors: { general: "Name, email and device type are required." },
      });
    }

    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    device_type = String(device_type).trim();
    primary_use_case = primary_use_case ? String(primary_use_case).trim() : null;
    preferred_ide = preferred_ide ? String(preferred_ide).trim() : null;

    if (name.length < 1 || name.length > 100) {
      return res.status(400).json({
        success: false,
        errors: { name: "Please enter a valid name." },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        errors: { email: "Please enter a valid email address." },
      });
    }

    if (!VALID_DEVICE_TYPES.includes(device_type)) {
      return res.status(400).json({
        success: false,
        errors: { device_type: "Please select a device type." },
      });
    }

    if (primary_use_case && !VALID_USE_CASES.includes(primary_use_case)) {
      return res.status(400).json({
        success: false,
        errors: { primary_use_case: "Please select a primary use case." },
      });
    }

    // -------------------------
    // Check current waitlist size
    // -------------------------

    const { count, error: countError } = await supabase
      .from("waitlist_users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Waitlist count error:", countError);
      return res.status(500).json({
        success: false,
        errors: { general: "Unable to check waitlist capacity." },
      });
    }

    if (count >= 200) {
      return res.status(409).json({
        success: false,
        errors: { general: "The Decode waitlist is currently full." },
      });
    }

    // -------------------------
    // Check duplicate email
    // -------------------------

    const { data: existingUser, error: existingError } = await supabase
      .from("waitlist_users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      console.error("Duplicate check error:", existingError);
      return res.status(500).json({
        success: false,
        errors: { general: "Unable to process your request." },
      });
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        errors: { email: "You have already joined the waitlist." },
      });
    }

    // -------------------------
    // Insert user
    // -------------------------

    const insertData = { name, email, device_type };
    if (primary_use_case) insertData.primary_use_case = primary_use_case;
    if (preferred_ide) insertData.preferred_ide = preferred_ide;

    const { data, error: insertError } = await supabase
      .from("waitlist_users")
      .insert([insertData])
      .select("id, name, email, device_type, primary_use_case, preferred_ide, created_at")
      .single();

    if (insertError) {
      console.error("Waitlist insert error:", insertError);

      if (insertError.code === "23505") {
        return res.status(409).json({
          success: false,
          errors: { email: "You have already joined the waitlist." },
        });
      }

      if (
        insertError.code === "P0001" ||
        /WAITLIST_FULL/.test(insertError.message || "")
      ) {
        return res.status(409).json({
          success: false,
          errors: { general: "The Decode waitlist is currently full." },
        });
      }

      return res.status(500).json({
        success: false,
        errors: { general: "Unable to join the waitlist." },
      });
    }

    // -------------------------
    // Success response
    // -------------------------

    return res.status(201).json({
      success: true,
      id: data.id,
      message: "Successfully joined the Decode waitlist.",
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return res.status(500).json({
      success: false,
      errors: { general: "Something went wrong. Please try again." },
    });
  }
});


module.exports = router;
