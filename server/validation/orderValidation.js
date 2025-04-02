// validators/orderValidation.js
const Joi = require("joi");

const orderValidationSchema = Joi.object({
  bookId: Joi.string().required(), // Validasi panjang ID MongoDB
  totalPrice: Joi.number().required(), // Harga total
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed")
    .default("pending"), // Status pembayaran
});

const validateOrderData = (data) => {
  const { error } = orderValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

module.exports = { validateOrderData };
