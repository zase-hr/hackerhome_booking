var Sequelize = require('Sequalize');

const sequelize = new Sequelize('booking', 'yerin', 'yerin', {
  host: 'localhost:3000',
  dialect: mysql
});

var Room = sequelize.define('rooms', {
  roomname: Sequelize.STRING,
  price: Sequelize.INTEGER,
  cleaning_fee:Sequelize.INTEGER,
  service_fee:Sequelize.INTEGER,
  tax:Sequelize.INTEGER,
  max_guest: Sequelize.INTEGER,
  min_night: Sequelize.INTEGER,
  max_night: Sequelize.INTEGER,
  ratings: Sequelize.DECIMAL(2,1),
  num_reviews: Sequelize.INTEGER
});

var Booking = sequelize.define('bookings', {
  email: Sequelize.STRING,
  guests: Sequelize.INTEGER,
  check_in: Sequelize.DATE,
  check_out: Sequelize.DATE,
  createdAt: Sequelize.DATE,
});

Room.hasMany(Booking);
Booking.belongsTo(Room);

Room.sync();
Booking.sync();

module.exports = {
  Room,
  Booking
}
