require('newrelic');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getRoom } = require('./controllers/rooms.js');
const { getBookings, addBooking } = require('./controllers/bookings.js');
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
  getRoom(req, res);
});

app.get('/bookings/:id', (req, res) => {
  getBookings(req, res);
});

/* POST REQUESTS */
app.post('/bookings', (req, res) => {
  addBooking(req, res);
});

app.post('/rooms', (req, res) => {
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
      res.status(200).send(`Affected rows: ${affectedRows}`);
    })
    .catch((err) => {
      console.error('Couldn\'t update booking', err);
      res.status(500).send('Couldn\'t update booking');
    });
});

/* DELETE REQUESTS */
app.delete('/bookings', (req, res) => {
  db.Booking.destroy({
    where: { id: req.body.id },
  })
    .then(() => {
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
