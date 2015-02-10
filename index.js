'use strict';
var dns = require('dns');
var url = require('url');
var request = require('request');

var Request = request.Request;
Request.prototype.original_init = Request.prototype.init;

Request.prototype.init = function (options) {
	var self = this;
	if (!options) {
		options = {};
	}

	// People use this property instead all the time, so support it.
	if (!self.uri && self.url) {
		self.uri = self.url;
		delete self.url;
	}

	// A URI is needed by this point, throw if we haven't been able to get one.
	if (!self.uri) {
		return self.emit('error', new Error('options.uri is a required argument'));
	}

	// If a string URI/URL was given, parse it into a URL object.
	if(typeof self.uri === 'string') {
		self.uri = url.parse(self.uri);
	}

	// We can not support unix sockets in this library.
	if(self.uri.host === 'unix') {
		throw new Error('Unix sockets are not supported by srv-request');
	}

	dns.resolveSrv(self.uri.host, function (err, records) {
		if (err) {
			throw new Error('DNS SRV lookup error');
		}

		// TODO: We need this more sexy. And (optionally) caching.
		var item = records[Math.floor(Math.random() * records.length)];

		self.uri.host = item.name;
		self.uri.hostname = item.name;
		self.uri.port = item.port;
		options.uri = self.uri;

		self.original_init(options);
	});
};

module.exports = request;
