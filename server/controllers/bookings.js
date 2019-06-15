const db = require('../../db');

exports.getBookings = (req, res) => {
  const query = 'SELECT bookings.bookings.*, bookings.users.* from bookings.rooms '
              + 'INNER JOIN bookings.bookings '
              + 'ON (bookings.rooms.id = bookings.bookings.roomid) '
              + 'INNER JOIN bookings.users '
              + 'ON (bookings.bookings.userid = bookings.users.id) '
              + 'WHERE bookings.rooms.id = $1';
  const { id } = req.params;
  db.query(query, [id], (err, result) => {
    if (err) { return res.status(400).send(err); }
    const formattedArr = result.rows.map(booking => ({
      check_in: booking.check_in,
      check_out: booking.check_out,
      createdAt: booking.createdat,
      email: booking.email,
      guests: {
        adults: booking.adults,
        children: booking.children,
        infants: booking.children,
      },
      id: booking.id,
      roomId: booking.roomid,
    }));
    return res.send(formattedArr);
  });
};

exports.addBooking = (req, res) => {
  const insertUser = 'INSERT INTO bookings.users (email, username, password, first_name, last_name, registration_date, id) '
  + 'VALUES ($1, $2, $3, $4, $5, DEFAULT, DEFAULT) RETURNING *';
  db.query(insertUser,
    [
      req.body.email,
      req.body.username,
      req.body.password,
      req.body.first_name,
      req.body.last_name,
    ], (err, result) => {
      if (err) { return res.status(400).send(err); }
      const user = result.rows[0];
      const insertBooking = 'INSERT INTO bookings.bookings '
         + '(roomid, userid, adults, children, infants, check_in, check_out, createdat, id) '
         + 'VALUES ($1, $2, $3, $4, $5, $6, $7, DEFAULT, DEFAULT) RETURNING *';
      return db.query(insertBooking,
        [
          req.body.roomId,
          user.id,
          req.body.adults,
          req.body.children,
          req.body.infants,
          req.body.check_in,
          req.body.check_out,
        ], (err, result) => {
          if (err) { return res.status(400).send(err); }
          return res.send(result.rows[0]);
        });
    });
};
