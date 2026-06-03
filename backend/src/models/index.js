const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = config.url
  ? new Sequelize(config.url, {
      dialect: config.dialect || 'postgres',
      logging: config.logging,
      pool: config.pool,
      dialectOptions: config.dialectOptions,
      define: { underscored: true },
    })
  : new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging,
      pool: config.pool,
      dialectOptions: config.dialectOptions,
      define: { underscored: true },
    });

const Product = require('./Product')(sequelize);
const Customer = require('./Customer')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);

Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  Sequelize,
  Product,
  Customer,
  Order,
  OrderItem,
};
