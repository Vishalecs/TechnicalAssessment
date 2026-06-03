const { Sequelize, sequelize, Order, OrderItem, Product, Customer } = require('../models');
const ApiError = require('../utils/ApiError');

const createOrder = async ({ customerId, items }) => {
  const transaction = await sequelize.transaction();

  try {
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: Sequelize.Transaction.LOCK.UPDATE,
      });

      if (!product) {
        throw new ApiError(404, `Product with id ${item.productId} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`
        );
      }

      const unitPrice = parseFloat(product.price);
      const lineTotal = unitPrice * item.quantity;
      totalAmount += lineTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        product,
      });
    }

    const order = await Order.create(
      {
        customerId,
        totalAmount: totalAmount.toFixed(2),
        status: 'confirmed',
      },
      { transaction }
    );

    for (const itemData of orderItemsData) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          unitPrice: itemData.unitPrice,
        },
        { transaction }
      );

      await itemData.product.update(
        { quantity: itemData.product.quantity - itemData.quantity },
        { transaction }
      );
    }

    await transaction.commit();

    return getOrderById(order.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAllOrders = async () => {
  return Order.findAll({
    include: [
      { model: Customer, as: 'customer', attributes: ['id', 'fullName', 'email'] },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

const getOrderById = async (id) => {
  const order = await Order.findByPk(id, {
    include: [
      { model: Customer, as: 'customer' },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return order;
};

const deleteOrder = async (id) => {
  const order = await getOrderById(id);
  await order.destroy();
  return { message: 'Order deleted successfully' };
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
};
