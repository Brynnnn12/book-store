const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Fungsi untuk memvalidasi UUID
const isValidUUID = (id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const bookSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(), // UUID sebagai default _id
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true, // Pastikan slug unik
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10, // Tambahkan minimal panjang deskripsi
    },
    categoryId: {
      type: String, // Menggunakan String untuk UUID
      ref: "Category", // Referensi ke model Category
      required: true,
      validate: {
        validator: isValidUUID, // Validasi UUID
        message: "categoryId tidak valid. Harus berupa UUID yang valid.",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    coverImage: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v); // Memastikan Cover Image valid
        },
        message: "Cover image harus berupa URL gambar (jpg, jpeg, png, webp)!",
      },
    },
  },
  { timestamps: true }
);

// Fungsi untuk membuat slug secara manual
function generateSlug(title) {
  return title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Mengganti spasi dengan "-"
    .replace(/[^\w\-]+/g, "") // Menghapus karakter yang tidak valid
    .replace(/\-\-+/g, "-") // Mengganti "--" dengan "-"
    .replace(/^-+/, "") // Menghapus "-" di awal
    .replace(/-+$/, ""); // Menghapus "-" di akhir
}

// Middleware untuk menghasilkan slug otomatis sebelum disimpan
bookSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.slug = generateSlug(this.title);

    // Memastikan slug unik
    const existingBook = await this.constructor.findOne({ slug: this.slug });
    if (existingBook) {
      return next(new Error("Slug harus unik."));
    }
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
