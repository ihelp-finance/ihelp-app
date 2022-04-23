
const config = {
  apiPath: process.env.API_PATH || '/api/v1',
  database: process.env.DATABASE_URI || 'postgres://postgres:gisp123@localhost:5432/ihelp',
  deploy: process.env.ENV || 'local', // local, cloud
};

module.exports = config;
