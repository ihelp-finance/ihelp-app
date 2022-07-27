
const config = {
  apiPath: process.env.API_PATH || '/api/v1',
  database: process.env.DATABASE_URI,
  deploy: process.env.ENV || 'local', // local, cloud
};

module.exports = config;
