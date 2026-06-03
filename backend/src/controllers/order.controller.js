const orderService = require('../services/order.service');
const asyncHandler = require('../utils/asyncHandler');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.status(201).json({ success: true, data: order });
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(200).json({ success: true, data: orders });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  res.status(200).json({ success: true, data: order });
});

const deleteOrder = asyncHandler(async (req, res) => {
  const result = await orderService.deleteOrder(req.params.id);
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
};
