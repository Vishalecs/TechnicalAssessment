const express = require('express');
const customerController = require('../controllers/customer.controller');
const validate = require('../middleware/validate');
const { createCustomerSchema, idParamSchema } = require('../validations/customer.validation');

const router = express.Router();

router.post('/', validate(createCustomerSchema), customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.get('/:id', validate(idParamSchema, 'params'), customerController.getCustomer);
router.delete('/:id', validate(idParamSchema, 'params'), customerController.deleteCustomer);

module.exports = router;
