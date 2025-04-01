const Joi = require("joi");

const categoryValidationSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(5).optional(),
});

const validateCategoryData = (data) => {
  const { error } = categoryValidationSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

module.exports = validateCategoryData;
