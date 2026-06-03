const express = require('express');
const productController = require('../controllers/product.controller');
const validate = require('../middleware/validate');
const {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
} = require('../validations/product.validation');

const router = express.Router();

router.post('/', validate(createProductSchema), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', validate(idParamSchema, 'params'), productController.getProduct);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete('/:id', validate(idParamSchema, 'params'), productController.deleteProduct);

module.exports = router;
