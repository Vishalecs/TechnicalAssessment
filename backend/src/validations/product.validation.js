const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  sku: Joi.string().trim().min(1).max(100).required(),
  price: Joi.number().min(0).precision(2).required(),
  quantity: Joi.number().integer().min(0).default(0),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  sku: Joi.string().trim().min(1).max(100),
  price: Joi.number().min(0).precision(2),
  quantity: Joi.number().integer().min(0),
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
};
