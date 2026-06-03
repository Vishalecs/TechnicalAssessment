const { Customer } = require('../models');
const ApiError = require('../utils/ApiError');

const createCustomer = async (data) => {
  const existing = await Customer.findOne({ where: { email: data.email } });
  if (existing) {
    throw new ApiError(409, 'Email already exists');
  }
  return Customer.create(data);
};

const getAllCustomers = async () => {
  return Customer.findAll({ order: [['createdAt', 'DESC']] });
};

const getCustomerById = async (id) => {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }
  return customer;
};

const deleteCustomer = async (id) => {
  const customer = await getCustomerById(id);
  await customer.destroy();
  return { message: 'Customer deleted successfully' };
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
};
