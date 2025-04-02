const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderPaymentStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");
const { uploadPaymentProof } = require("../utils/fileUpload");

// Rute untuk mendapatkan semua pesanan
router.get("/", protect, getOrders);

// Rute untuk mendapatkan pesanan berdasarkan ID
router.get("/:id", protect, getOrderById);

// Rute untuk membuat pesanan baru
router.post(
  "/",
  protect,
  uploadPaymentProof.single("paymentProof"),
  createOrder
);

// Rute untuk mengupdate status pembayaran pesanan
router.put("/:id/payment-status", protect, admin, updateOrderPaymentStatus);

// Rute untuk menghapus pesanan berdasarkan ID
router.delete("/:id", protect, deleteOrder);

module.exports = router;
