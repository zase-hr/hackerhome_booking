// const Sequelize = require('sequelize');
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'airbnb',
});

const query = (text, params, callback) => {
  const start = Date.now()
  return pool.query(text, params, (err, res) => {
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    callback(err, res);
  });
};

module.exports = {
  query,
};
