const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

// Rute untuk mendapatkan semua kategori
router.get("/", getAllCategories);

// Rute untuk mendapatkan kategori berdasarkan ID
router.get("/:id", protect, admin, getCategory);

// Rute untuk membuat kategori baru
router.post("/", protect, admin, createCategory);

// Rute untuk mengupdate kategori berdasarkan ID
router.put("/:id", protect, admin, updateCategory);

// Rute untuk menghapus kategori berdasarkan ID
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
