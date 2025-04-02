const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validate = (schema, data) => {
  const { error } = schema.validate(data);
  return { error }; // Selalu mengembalikan objek, bukan melempar error
};

module.exports = {
  validateUser: (data) => validate(userSchema, data),
  validateLogin: (data) => validate(loginSchema, data),
};
