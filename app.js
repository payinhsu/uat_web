'use strict';

var path = require('path');
var config = require('./config-prod.js');

process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();
require('babel-core/register')({});
require('babel-polyfill');

var server = require('./server').default;

//const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT || config.localPort;


server.listen(PORT, function () {
  console.log('server listening on: ' + PORT);
});

server.on('listening', function() {
		console.log('server online');
		if (process.send) process.send('online');
	});
