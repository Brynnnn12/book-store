// server/models/Order.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4, // UUID sebagai default _id
    },
    userId: {
      type: String, // Menggunakan UUID sebagai string

      required: true,

      ref: "User", // Referensi ke model User
    },

    bookId: {
      type: String, // Menggunakan UUID sebagai string

      required: true,

      ref: "Book", // Referensi ke model Book
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentProof: {
      type: String, // URL gambar bukti pembayaran
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Aktifkan createdAt & updatedAt otomatis
  }
);

module.exports = mongoose.model("Order", orderSchema);
