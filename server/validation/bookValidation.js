const Joi = require("joi");

// Schema validasi untuk create dan update
const bookValidationSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  author: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  categoryId: Joi.string().required(), // Memvalidasi ID kategori sebagai string (UUID)
  price: Joi.number().min(0).required(),
});

// Fungsi validasi menggunakan Joi
const validateBookData = (data) => {
  const { error } = bookValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

module.exports = { validateBookData };
