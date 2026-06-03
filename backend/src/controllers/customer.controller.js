const customerService = require('../services/customer.service');
const asyncHandler = require('../utils/asyncHandler');

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json({ success: true, data: customer });
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await customerService.getAllCustomers();
  res.status(200).json({ success: true, data: customers });
});

const getCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.status(200).json({ success: true, data: customer });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const result = await customerService.deleteCustomer(req.params.id);
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  deleteCustomer,
};
