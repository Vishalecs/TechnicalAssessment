const { DataTypes } = require('sequelize');

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

module.exports = (sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'customer_id',
        references: {
          model: 'customers',
          key: 'id',
        },
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'total_amount',
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM(...ORDER_STATUSES),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      tableName: 'orders',
      timestamps: true,
      underscored: true,
    }
  );

  Order.ORDER_STATUSES = ORDER_STATUSES;
  return Order;
};
