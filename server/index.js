const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../db');


const app = express();
const port = 3003;
app.use(express.static(path.join(__dirname, '../public/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cors());

/* GET REQUESTS */
app.get('/rooms/:id', (req, res) => {
  const query = 'SELECT * FROM bookings.rooms '
              + 'WHERE bookings.rooms.id = $1';
  const { id } = req.params;

  db.query(query, [id], (err, results) => {
    if (err) { return res.status(400).send(err); }
    const room = results.rows[0];
    const formattedRoom = {
      roomname: room.roomname,
      cleaning_fee: room.cleaning_fee,
      id: room.id,
      max_guest: {
        adults: room.adults,
        children: room.children,
        infants: room.infants,
      },
      max_night: room.max_night,
      min_night: room.min_night,
      num_reviews: room.num_reviews,
      price: room.price,
      ratings: room.ratings,
      service_fee: room.service_fee,
      tax: room.tax,
    };
    return res.send(formattedRoom);
  });
});


app.get('/bookings/:id', (req, res) => {
  const query = 'SELECT bookings.bookings.*, bookings.users.email from bookings.rooms '
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
    res.send(formattedArr);
  });
});

/* POST REQUESTS */
app.post('/bookings', (req, res) => {
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
      db.query(insertBooking,
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
});

app.post('/rooms', (req, res) => {
  console.log(req.body);
  const data = {
    roomname: req.body.roomname,
    price: req.body.price,
    cleaning_fee: req.body.cleaning_fee,
    service_fee: req.body.service_fee,
    tax: req.body.tax,
    max_guest: req.body.max_guest,
    min_night: req.body.min_night,
    max_night: req.body.max_night,
    ratings: req.body.ratings,
    num_reviews: req.body.num_reviews,
  };

  db.Room.create(data)
    .then(() => {
      res.status(200).send('Room has been added');
    })
    .catch((e) => {
      res.status(500).send('Coudln\'t add room');
    });
});

/* PUT REQUESTS */
app.put('/bookings', (req, res) => {
  db.Booking.update(req.body, {
    where: { id: req.body.id },
  })
    .then((affectedRows) => {
      console.log(`Affected rows: ${affectedRows}`);
      res.status(200).send(`Affected rows: ${affectedRows}`);
    })
    .catch((err) => {
      console.error('Couldn\'t update booking', err);
      res.status(500).send('Couldn\'t update booking');
    });
});

app.put('/rooms', (req, res) => {
  db.Room.update(req.body, {
    where: { id: req.body.id },
  })
    .then((affectedRows) => {
      console.log(`Affected rows: ${affectedRows}`);
      res.status(200).send(`Affected rows: ${affectedRows}`);
    })
    .catch((err) => {
      console.error('Couldn\'t update booking', err);
      res.status(500).send('Couldn\'t update booking');
    });
});

/* DELETE REQUESTS */
app.delete('/bookings', (req, res) => {
  console.log(req.body);
  db.Booking.destroy({
    where: { id: req.body.id },
  })
    .then(() => {
      console.log('Booking has been deleted');
      res.send(200).send('Booking has been deleted');
    })
    .catch((e) => {
      console.error('Couldn\'t delete booking', e);
      res.status(500).send('Couldn\'t delete booking');
    });
});

app.delete('/rooms', (req, res) => {
  db.Room.destroy({
    where: { id: req.body.id },
  })
    .then(() => {
      console.log('Room has been deleted');
      res.status(200).send('Room has been deleted');
    })
    .catch((e) => {
      console.error('Couldn\'t delete room', e);
      res.status(500).send('Couldn\'t delete room');
    });
});

app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
