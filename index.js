const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set CORS headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.FRONT_URL);
  next();
});

require('./src/router')(app);

app.listen(process.env.PORT, () => console.log('Server Started'));