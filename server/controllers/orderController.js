const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const Order = require("../models/Order");
const { validateOrderData } = require("../validation/orderValidation"); // Import validasi

// Mendapatkan semua pesanan
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email") // Mengisi data pengguna
    .populate("bookId", "title author price"); // Mengisi data buku

  res.status(200).json({
    status: true,
    message: "Pesanan berhasil ditemukan",
    data: orders,
  });
});

// Mendapatkan pesanan berdasarkan ID
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email") // Mengisi data pengguna
    .populate("bookId", "title author price"); // Mengisi data buku

  if (order) {
    res.status(200).json({
      status: true,
      message: "Pesanan berhasil ditemukan",
      data: order,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Pesanan tidak ditemukan",
    });
  }
});

// Membuat pesanan baru
exports.createOrder = asyncHandler(async (req, res) => {
  // Validasi data pesanan
  validateOrderData(req.body);

  const { bookId, totalPrice, paymentProof } = req.body;
  const userId = req.user._id; // Mengambil userId dari req.user

  // Cek apakah bookId valid dan ada di database
  const bookExists = await Book.findById(bookId);
  if (!bookExists) {
    return res.status(404).json({
      status: false,
      message: "Buku tidak ditemukan",
    });
  }

  // Membuat pesanan baru
  const order = new Order({
    userId,
    bookId,
    totalPrice,
    paymentProof,
    paymentStatus: "pending", // Set status pembayaran otomatis ke "pending"
  });

  const createdOrder = await order.save();

  res.status(201).json({
    status: true,
    message: "Pesanan berhasil dibuat",
    data: createdOrder,
  });
});

// Mengupdate status pembayaran pesanan
exports.updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

  // Validasi status pembayaran
  if (!["pending", "completed", "failed"].includes(paymentStatus)) {
    return res.status(400).json({
      status: false,
      message: "Status pembayaran tidak valid",
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      status: false,
      message: "Pesanan tidak ditemukan",
    });
  }

  // Update status pembayaran
  order.paymentStatus = paymentStatus;
  const updatedOrder = await order.save();

  res.status(200).json({
    status: true,
    message: "Status pembayaran pesanan berhasil diperbarui",
    data: updatedOrder,
  });
});

// Menghapus pesanan berdasarkan ID
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      status: false,
      message: "Pesanan tidak ditemukan",
    });
  }

  await order.deleteOne();
  res.status(200).json({
    status: true,
    message: "Pesanan berhasil dihapus",
  });
});
