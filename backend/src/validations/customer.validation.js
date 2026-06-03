const Joi = require('joi');

const createCustomerSchema = Joi.object({
  fullName: Joi.string().trim().min(1).max(255).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().max(50).allow('', null),
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  createCustomerSchema,
  idParamSchema,
};
