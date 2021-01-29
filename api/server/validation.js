// Imports
const Joi = require('joi');

// Register validation
module.exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(255).required()
  });
  return schema.validate(data);
};

// Login validation
module.exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(255).required()
  });
  return schema.validate(data);
};
