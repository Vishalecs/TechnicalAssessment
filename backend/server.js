require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');
const config = require('./src/config');

const PORT = config.port;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
