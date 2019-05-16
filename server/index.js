var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = 3000;
app.use(bodyParser());
app.use(cors());
app.use(express.static(__dirname, 'public'));

app.get('/booking', (req, res) => {

});

app.get('/room', (req, res) => {

});

app.post('/', (req, res) => {

});

app.listen(port, () => {
  console.log("Listening port: " + port)
});