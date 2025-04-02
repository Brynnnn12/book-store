const asyncHandler = require("express-async-handler");
const { validateBookData } = require("../validation/bookValidation"); // Import validasi
const Book = require("../models/Book");
const { extractPublicId, deleteImage } = require("../helpers/cloudinaryUpload");

// Get all books with pagination and filtering
exports.getBooks = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const category = req.query.category ? { categoryId: req.query.category } : {};

  const count = await Book.countDocuments({ ...keyword, ...category });

  const books = await Book.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })
    .populate("categoryId", "name description");

  return res.status(200).json({
    status: true,
    message: "Books retrieved successfully",
    data: {
      books,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    },
  });
});

// Get book by ID
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate(
    "categoryId",
    "name description"
  );

  if (book) {
    return res.status(200).json({
      status: true,
      message: "Book found",
      data: book,
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "Buku tidak ditemukan",
    });
  }
});

// Create a new book with validation
exports.createBook = asyncHandler(async (req, res) => {
  // Validasi data buku
  validateBookData(req.body);

  const { title, author, description, categoryId, price } = req.body;

  // URL bisa langsung diakses dari req.file
  const coverImage = req.file ? req.file.path : null;

  // Validasi UUID untuk categoryId sudah diterapkan di model
  const book = await Book.create({
    title,
    author,
    description,
    categoryId,
    price,
    coverImage,
  });

  if (book) {
    return res.status(201).json({
      status: true,
      message: "Book created successfully",
      data: book,
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Data buku tidak valid",
    });
  }
});

// Update book by ID with validation
exports.updateBook = asyncHandler(async (req, res) => {
  // Validasi data buku
  validateBookData(req.body);

  const { title, author, description, categoryId, price } = req.body;
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      status: false,
      message: "Buku tidak ditemukan",
    });
  }

  // Simpan URL gambar lama sebelum diupdate
  const oldCoverImage = book.coverImage;

  // Update data buku
  book.title = title || book.title;
  book.author = author || book.author;
  book.description = description || book.description;
  book.categoryId = categoryId || book.categoryId;
  book.price = price || book.price;

  // Handle pembaruan gambar sampul
  if (req.file) {
    const newCoverImage = req.file.path;

    // Hapus gambar lama jika ada
    if (oldCoverImage) {
      const publicId = extractPublicId(oldCoverImage);
      if (publicId) {
        const deletionResult = await deleteImage(publicId);
        if (deletionResult.result !== "ok") {
          console.warn("Gagal menghapus gambar lama:", deletionResult);
        }
      }
    }

    book.coverImage = newCoverImage;
  }

  const updatedBook = await book.save();
  return res.json({
    status: true,
    message: "Book updated successfully",
    data: updatedBook,
  });
});

// Delete book by ID
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book?.coverImage) {
    const publicId = extractPublicId(book.coverImage);
    if (publicId) await deleteImage(publicId);
  }

  await Book.deleteOne({ _id: req.params.id });

  return res.json({
    status: true,
    message: "Buku berhasil dihapus",
  });
});
