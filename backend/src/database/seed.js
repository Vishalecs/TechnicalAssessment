require('dotenv').config();

const { sequelize, Product, Customer, Order, OrderItem } = require('../models');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ force: false });
    console.log('Models synced.');

    const existingProducts = await Product.count();
    if (existingProducts > 0) {
      console.log('Database already has data. Skipping seed.');
      console.log(`  Products: ${await Product.count()}`);
      console.log(`  Customers: ${await Customer.count()}`);
      console.log(`  Orders: ${await Order.count()}`);
      process.exit(0);
    }

    console.log('Seeding sample data...');

    const products = await Product.bulkCreate([
      { name: 'Wireless Mouse', sku: 'WM-001', price: 29.99, quantity: 50 },
      { name: 'Mechanical Keyboard', sku: 'KB-002', price: 89.99, quantity: 25 },
      { name: 'USB-C Hub', sku: 'HUB-003', price: 45.00, quantity: 3 },
      { name: 'Monitor Stand', sku: 'MS-004', price: 35.50, quantity: 2 },
      { name: 'Webcam HD', sku: 'WC-005', price: 59.99, quantity: 15 },
      { name: 'Laptop Sleeve', sku: 'LS-006', price: 24.99, quantity: 0 },
    ]);

    const customers = await Customer.bulkCreate([
      { fullName: 'Alice Johnson', email: 'alice@example.com', phone: '+1 555-0101' },
      { fullName: 'Bob Smith', email: 'bob@example.com', phone: '+1 555-0102' },
      { fullName: 'Carol Williams', email: 'carol@example.com', phone: '+1 555-0103' },
    ]);

    const order1Total = 29.99 * 2 + 89.99 * 1;
    const order1 = await Order.create({
      customerId: customers[0].id,
      totalAmount: order1Total.toFixed(2),
      status: 'confirmed',
    });

    await OrderItem.bulkCreate([
      { orderId: order1.id, productId: products[0].id, quantity: 2, unitPrice: 29.99 },
      { orderId: order1.id, productId: products[1].id, quantity: 1, unitPrice: 89.99 },
    ]);

    await products[0].update({ quantity: products[0].quantity - 2 });
    await products[1].update({ quantity: products[1].quantity - 1 });

    const order2Total = 59.99 * 1;
    const order2 = await Order.create({
      customerId: customers[1].id,
      totalAmount: order2Total.toFixed(2),
      status: 'pending',
    });

    await OrderItem.create({
      orderId: order2.id,
      productId: products[4].id,
      quantity: 1,
      unitPrice: 59.99,
    });

    await products[4].update({ quantity: products[4].quantity - 1 });

    console.log('\nSeed completed successfully!');
    console.log(`  Products:  ${products.length}`);
    console.log(`  Customers: ${customers.length}`);
    console.log(`  Orders:    2`);
    console.log('\nLow-stock items (qty < 5): USB-C Hub, Monitor Stand, Laptop Sleeve');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
