const express = require('express');
const orderController = require('../controllers/order.controller');
const validate = require('../middleware/validate');
const { createOrderSchema, idParamSchema } = require('../validations/order.validation');

const router = express.Router();

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', validate(idParamSchema, 'params'), orderController.getOrder);
router.delete('/:id', validate(idParamSchema, 'params'), orderController.deleteOrder);

module.exports = router;
