const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./src/router')(app);

app.listen(process.env.PORT, () => console.log('Server Started'));