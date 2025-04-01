// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  logout,
} = require("../controllers/authContoller");
const { protect } = require("../middleware/authMiddleware");

// Rute untuk registrasi user
router.post("/register", register);

// Rute untuk login user
router.post("/login", login);

router.post("/logout", protect, logout);

// Rute untuk mendapatkan profil user (hanya bisa diakses jika sudah login)
router.get("/profile", protect, getProfile);

module.exports = router;
