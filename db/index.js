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

// const sequelize = new Sequelize('booking', 'root', 'student', {
//   host: 'localhost',
//   dialect: 'mysql',
// });


// const Room = sequelize.define('rooms', {
//   id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//   roomname: Sequelize.STRING,
//   price: Sequelize.INTEGER,
//   cleaning_fee: Sequelize.INTEGER,
//   service_fee: Sequelize.INTEGER,
//   tax: Sequelize.INTEGER,
//   max_guest: Sequelize.STRING,
//   min_night: Sequelize.INTEGER,
//   max_night: Sequelize.INTEGER,
//   ratings: Sequelize.DECIMAL(2, 1),
//   num_reviews: Sequelize.INTEGER,
// });

// const Booking = sequelize.define('bookings', {
//   email: Sequelize.STRING,
//   guests: Sequelize.STRING,
//   check_in: Sequelize.DATE,
//   check_out: Sequelize.DATE,
//   createdAt: Sequelize.DATE,
//   roomId: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: 'rooms',
//       key: 'id',
//     },
//   },
// });

// Room.hasMany(Booking, { foreignKey: 'roomId' });
// Booking.belongsTo(Room, { foreignKey: 'roomId' });

// sequelize.authenticate();

// Room.sync();
// Booking.sync();

// module.exports = {
//   Room,
//   Booking,
// };
