require('dotenv').config();

const productionSsl =
  process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
    ? {
        require: true,
        rejectUnauthorized: false,
      }
    : false;

const baseProduction = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: productionSsl ? { ssl: productionSsl } : {},
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// Cloud hosts (Neon, Render, Railway) often provide DATABASE_URL
if (process.env.DATABASE_URL) {
  module.exports = {
    development: { url: process.env.DATABASE_URL, dialect: 'postgres', logging: console.log },
    production: { url: process.env.DATABASE_URL, ...baseProduction },
    test: { url: process.env.DATABASE_URL, dialect: 'postgres', logging: false },
  };
} else {
  module.exports = {
    development: {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'inventory_db',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    },
    production: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      ...baseProduction,
    },
    test: {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'inventory_test',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      dialect: 'postgres',
      logging: false,
    },
  };
}
