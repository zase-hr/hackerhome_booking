const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + './public/dist'));

app.get('/booking', (req, res) => {
  console.log(req.body);
  res.send('hi');
});

app.get('/room', (req, res) => {
  console.log(req.body);
  res.send('hi');
});

app.post('/', (req, res) => {
  console.log(req.body);
  res.send('hi');
});

app.listen(port, () => {
  console.log(`Listening port: ${port}`);
});
