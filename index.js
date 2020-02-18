const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Set CORS headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.FRONT_URL);
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./src/router')(app);

app.listen(process.env.PORT, () => console.log('Server Started'));