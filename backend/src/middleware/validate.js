const ApiError = require('../utils/ApiError');

/**
 * Joi validation middleware factory.
 */
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    return next(new ApiError(400, 'Validation failed', errors));
  }

  req[property] = value;
  next();
};

module.exports = validate;
