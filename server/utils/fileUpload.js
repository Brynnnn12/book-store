// utils/fileUpload.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Filter format file yang diperbolehkan
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Hanya file gambar (JPG, PNG, GIF) yang diperbolehkan"),
      false
    );
  }
};

// Konfigurasi penyimpanan di Cloudinary untuk gambar buku
const bookStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "booksapp/book",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    transformation: [
      { width: 800, height: 600, crop: "limit", quality: "auto" },
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10); // 8 karakter random
      const titleSlug = req.body.title
        ? req.body.title.replace(/\s+/g, "_").toLowerCase().substring(0, 20)
        : "untitled";
      return `book_${titleSlug}_${timestamp}_${randomString}`;
    },
  },
});

// Konfigurasi penyimpanan di Cloudinary untuk bukti pembayaran
const paymentProofStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "booksapp/paymentProof",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 10); // 8 karakter random
      return `payment_proof_${timestamp}_${randomString}`;
    },
  },
});

// Middleware upload dengan batas ukuran 2MB untuk gambar buku
const uploadBook = multer({
  storage: bookStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter,
});

// Middleware upload dengan batas ukuran 2MB untuk bukti pembayaran
const uploadPaymentProof = multer({
  storage: paymentProofStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter,
});

module.exports = {
  uploadBook,
  uploadPaymentProof,
};
