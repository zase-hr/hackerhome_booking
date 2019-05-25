const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../db/dataGenerator.js');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '../public/dist')));
app.use(bodyParser.json());
app.use(cors());

app.get('/room', (req, res) => {
  db.Room.findAll({
    where: {
      id: req.query.roomId,
    },
  })
    .then((result) => {
      res.send(result[0].dataValues);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.get('/booking', (req, res) => {
  db.Booking.findAll({
    where: {
      roomId: req.query.roomId,
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
  console.log(req.body);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
