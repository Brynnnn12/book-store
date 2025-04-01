const asyncHandler = require("express-async-handler");
const { validateBookData } = require("../validation/bookValidation"); // Import validasi
const Book = require("../models/Book");

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

  res.status(200).json({
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
    res.status(200).json({
      status: true,
      message: "Book found",
      data: book,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Buku tidak ditemukan",
    });
  }
});

// Create a new book with validation
exports.createBook = asyncHandler(async (req, res) => {
  // Validasi data buku
  validateBookData(req.body);

  const { title, author, description, categoryId, price, coverImage } =
    req.body;

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
    res.status(201).json({
      status: true,
      message: "Book created successfully",
      data: book,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "Data buku tidak valid",
    });
  }
});

// Update book by ID with validation
exports.updateBook = asyncHandler(async (req, res) => {
  // Validasi data buku
  validateBookData(req.body);

  const { title, author, description, categoryId, price, coverImage } =
    req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;

    // Validasi UUID untuk categoryId sudah diterapkan di model
    book.categoryId = categoryId || book.categoryId;
    book.price = price || book.price;
    book.coverImage = coverImage || book.coverImage;

    const updatedBook = await book.save();
    res.json({
      status: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Buku tidak ditemukan",
    });
  }
});

// Delete book by ID
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await book.deleteOne();
    res.json({
      status: true,
      message: "Buku berhasil dihapus",
    });
  } else {
    res.status(404).json({
      status: false,
      message: "Buku tidak ditemukan",
    });
  }
});
