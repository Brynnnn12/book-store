const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const validateCategoryData = require("../validation/categoryValidation");

// Mendapatkan semua kategori
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return res.status(200).json({
    success: true,
    message: "Kategori berhasil ditemukan",
    data: categories,
  });
});

// Mendapatkan kategori berdasarkan ID
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Kategori tidak ditemukan");
  }

  return res.status(200).json({
    success: true,
    message: "Kategori berhasil ditemukan",
    data: category,
  });
});

// Membuat kategori baru
exports.createCategory = asyncHandler(async (req, res) => {
  validateCategoryData(req.body); // Validasi data
  const { name, description } = req.body;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(400);
    throw new Error("Kategori dengan nama tersebut sudah ada");
  }

  const newCategory = await Category.create({ name, description });
  return res.status(201).json({
    success: true,
    message: "Kategori berhasil dibuat",
    data: newCategory,
  });
});

// Mengupdate kategori berdasarkan ID
exports.updateCategory = asyncHandler(async (req, res) => {
  validateCategoryData(req.body);

  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Kategori tidak ditemukan");
  }

  category.name = name || category.name;
  category.description = description || category.description;

  const updatedCategory = await category.save();
  return res.status(200).json({
    success: true,
    message: "Kategori berhasil diperbarui",
    data: updatedCategory,
  });
});

// Menghapus kategori berdasarkan ID
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Kategori tidak ditemukan");
  }

  await category.deleteOne();
  return res.status(200).json({
    success: true,
    message: "Kategori berhasil dihapus",
  });
});
