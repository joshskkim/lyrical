const express = require('express');
const path = require('path');

const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');

app.use(compression());
app.use(express.static(path.join(__dirname, '../public/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api', (req, res) => {

});

module.exports = app;
