const express = require('express');
const productRoutes = require('./product.routes');
const customerRoutes = require('./customer.routes');
const orderRoutes = require('./order.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
