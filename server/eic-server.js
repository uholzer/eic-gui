"use strict";
var express = require('express'),
    fs = require('fs');

var app = module.exports = express.createServer();

app.start = function (port) {
  port = port || 4000;
  this.listen(port);
  console.log('Everything Is Connected server running at http://localhost:' + port + '/');
};

app.get('/', function (req, res) {
  res.send('Everything Is Connected');
});
