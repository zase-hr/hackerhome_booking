const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../db/index.js');


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
  db.Room.findAll({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      res.send(result[0].dataValues);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.get('/rooms', (req, res) => {
  db.Room.findAll()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error('Couldn\'t get rooms', err);
      res.status(500).send('Couldn\'t get rooms');
    });
});

app.get('/bookings/:id', (req, res) => {
  db.Booking.findAll({
    where: {
      roomId: req.params.id,
    },
  })
    .then((result) => {
      res.send(result);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.get('/bookings', (req, res) => {
  db.Booking.findAll()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error('Couldn\'t get bookings', err);
      res.status(500).send('Couldn\'t get bookings');
    });
});

/* POST REQUESTS */
app.post('/bookings', (req, res) => {
  console.log(req.body);
  const data = {
    roomId: req.body.roomId,
    email: req.body.email,
    guests: req.body.guests,
    check_in: new Date(req.body.check_in),
    check_out: new Date(req.body.check_out),
    createdAt: new Date(req.body.createdAt),
  };


  db.Booking.create(data)
    .catch((err) => {
      console.log(`err: ${err}`);
      res.sendStatus(500);
    })
    .then(() => {
      console.log('Booking data is saved');
      res.sendStatus(200);
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
