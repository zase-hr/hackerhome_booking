const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../db/index.js');


const app = express();
const port = 3003;
app.use(express.static(path.join(__dirname, '../public/dist')));
app.use(bodyParser.json());
app.use(cors());

app.get('/room/:id', (req, res) => {
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

app.get('/booking/:id', (req, res) => {
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


// making booking

app.post('/booking', (req, res) => {
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

app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
