const { Product, Customer, Order } = require('../models');
const { Op } = require('sequelize');

const LOW_STOCK_THRESHOLD = 5;

const getDashboardStats = async () => {
  const [totalProducts, totalCustomers, totalOrders, lowStockProducts] = await Promise.all([
    Product.count(),
    Customer.count(),
    Order.count(),
    Product.findAll({
      where: {
        quantity: {
          [Op.lt]: LOW_STOCK_THRESHOLD,
        },
      },
      attributes: ['id', 'name', 'sku', 'quantity', 'price'],
      order: [['quantity', 'ASC']],
    }),
  ]);

  return {
    totalProducts,
    totalCustomers,
    totalOrders,
    lowStockProducts,
  };
};

module.exports = { getDashboardStats };
