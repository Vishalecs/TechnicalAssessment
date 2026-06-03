require('dotenv').config();

const { sequelize } = require('../models');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established.');

    await sequelize.sync({ force: process.argv.includes('--force') });
    console.log('All models synchronized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
};

syncDatabase();
