// server/middleware/uploadMiddleware.js
const path = require("path");
const multer = require("multer");

// Konfigurasi penyimpanan untuk cover image
const storageImage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/images/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Konfigurasi penyimpanan untuk file PDF
const storagePDF = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/pdfs/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Filter file untuk gambar
const filterImage = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Hanya format gambar yang diperbolehkan!");
  }
};

// Filter file untuk PDF
const filterPDF = (req, file, cb) => {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Hanya format PDF yang diperbolehkan!");
  }
};

const uploadImage = multer({
  storage: storageImage,
  fileFilter: filterImage,
  limits: { fileSize: 5000000 }, // 5MB limit
});

const uploadPDF = multer({
  storage: storagePDF,
  fileFilter: filterPDF,
  limits: { fileSize: 20000000 }, // 20MB limit
});

module.exports = { uploadImage, uploadPDF };
