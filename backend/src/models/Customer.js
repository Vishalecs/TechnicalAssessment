const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'full_name',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: 'customers',
      timestamps: true,
      underscored: true,
    }
  );

  return Customer;
};
