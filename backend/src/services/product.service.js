const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

const createProduct = async (data) => {
  const existing = await Product.findOne({ where: { sku: data.sku } });
  if (existing) {
    throw new ApiError(409, 'SKU already exists');
  }
  return Product.create(data);
};

const getAllProducts = async () => {
  return Product.findAll({ order: [['createdAt', 'DESC']] });
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

const updateProduct = async (id, data) => {
  const product = await getProductById(id);

  if (data.sku && data.sku !== product.sku) {
    const existing = await Product.findOne({ where: { sku: data.sku } });
    if (existing) {
      throw new ApiError(409, 'SKU already exists');
    }
  }

  if (data.quantity !== undefined && data.quantity < 0) {
    throw new ApiError(400, 'Quantity cannot be negative');
  }

  await product.update(data);
  return product;
};

const deleteProduct = async (id) => {
  const product = await getProductById(id);
  await product.destroy();
  return { message: 'Product deleted successfully' };
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
