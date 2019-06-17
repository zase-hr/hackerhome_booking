/* eslint-disable no-console */
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'FuckYou52',
  database: 'airbnb',
});

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
});

const query = (text, params, callback) => {
  const start = Date.now();
  return pool.query(text, params, (err, res) => {
    if (err) { return callback(err); }
    const duration = Date.now() - start;
    console.log('executed query', { text, params, duration, rows: res.rowCount });
    callback(err, res);
  });
};

module.exports = {
  query,
};
