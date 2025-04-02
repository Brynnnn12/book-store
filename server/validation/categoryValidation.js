const Joi = require("joi");

const categoryValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    "string.base": "Nama kategori harus berupa teks",
    "string.empty": "Nama kategori tidak boleh kosong",
    "string.min": "Nama kategori harus memiliki minimal {#limit} karakter",
    "string.max": "Nama kategori tidak boleh lebih dari {#limit} karakter",
    "any.required": "Nama kategori wajib diisi",
  }),
  description: Joi.string().min(5).max(1000).optional().messages({
    "string.base": "Deskripsi harus berupa teks",
    "string.min": "Deskripsi harus memiliki minimal {#limit} karakter",
    "string.max": "Deskripsi tidak boleh lebih dari {#limit} karakter",
  }),
});

const validateCategoryData = (data) => {
  const { error } = categoryValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

module.exports = validateCategoryData;
