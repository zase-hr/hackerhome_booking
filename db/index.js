/* eslint-disable no-console */
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'airbnb',
});

const query = (text, params, callback) => {
  const start = Date.now();
  return pool.query(text, params, (err, res) => {
    const duration = Date.now() - start;
    //console.log('executed query', { text, params, duration, rows: res.rowCount });
    callback(err, res);
  });
};

module.exports = {
  query,
};
