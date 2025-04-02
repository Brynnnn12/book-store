// server/routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect, admin } = require("../middleware/authMiddleware");
const { uploadBook } = require("../utils/fileUpload");

// Menggunakan chaining untuk mendefinisikan route
router
  .route("/")
  .get(getBooks) // Mendapatkan semua buku (tidak perlu proteksi)
  .post(protect, admin, uploadBook.single("coverImage"), createBook); // Membuat buku baru (hanya admin yang bisa)

router
  .route("/:id")
  .get(getBookById) // Mendapatkan buku berdasarkan ID (tidak perlu proteksi)
  .put(protect, admin, uploadBook.single("coverImage"), updateBook) // Mengupdate buku berdasarkan ID (hanya admin yang bisa)
  .delete(protect, admin, deleteBook); // Menghapus buku berdasarkan ID (hanya admin yang bisa)

module.exports = router;
