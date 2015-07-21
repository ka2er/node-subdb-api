/**
 * User: seb
 * Date: 10/5/12
 * Time: 5:15 PM
 * To change this template use File | Settings | File Templates.
 */

var querystring = require('querystring'),
	http = require('http'),
	url = require('url'),
	fs = require('fs'),
	FormData = require('form-data'),
	clone = require('clone');

var ep = module.exports = function() {

	this.options = {
		//'hostname': 'sandbox.thesubdb.com', // buggy
		//'hostname': 'permita.se',
		'hostname': 'api.thesubdb.com',
		'agent': false,
		'headers': {
			'Content-length':0,
			'User-Agent': 'SubDB/1.0 (NodeSubdb/0.0.1; http://github.com/ka2er/node-subdb-api)'
		}
	};
};

ep.prototype.get = function(action, params, cb) {

	params.action = action;
	this.options.method = 'GET';
	this.options.path = "/?"+querystring.stringify(params);

	//console.log(this.options);

	var data = [];
	var req = http.request(this.options);
	req.on('response', function (response) {

        //to avoid problems with subtitle with a chatset different than utf-8

		response.on('data', function (chunk) {
			if(!!chunk && chunk.length > 0){
				data.push(chunk);
			}
		}).on('end', function(){
			cb(null, this.statusCode, Buffer.concat(data));
		});
	}).on('error', function(e) {
		cb(e);
	}).end();
};

ep.prototype.post = function(action, file, params, cb) {

	var opt = clone(this.options);
	opt.method = 'POST';
	opt.path = "/?"+querystring.stringify({action:action});

	var form = new FormData();
	form.append('file', fs.createReadStream(file));
	for(var i in params) {
		form.append(i, params[i]);
	}
	var headers = form.getHeaders();
	for(var i in headers) {
		opt.headers[i] = headers[i];
	}

	var req = http.request(opt);
	form.pipe(req);

	var data = '';
	req.on('response', function (response) {
		response.on('data', function (chunk) {
			data += chunk;
		}).on('end', function(){
			cb(null, this.statusCode, data);
		});
		req.end();
	}).on('error', function(e) {
		cb(e);
		req.end();
	});
};


/** protocol methods */
ep.prototype.available_languages = function(cb){
	this.get('languages',  {}, function(err, status, res) {
		if(err) return cb(err);
		res = res.toString();

		if(status == 400) return cb('Bad Request');

		cb(null, res.split(','));
	});
};
ep.prototype.search_subtitles = function(hash, versions, cb){
	var params = {hash:hash};
	if(typeof versions === 'function') cb = versions;
	else params.version = 1;

	this.get('search', params, function(err, status, res){
		if(err) return cb(err);
		res = res.toString();

		if(status == 400) return cb('Bad Request');
		if(status == 404) return cb(null, ''); // no subtitle found

		cb(null, res.split(','));
	});
};
ep.prototype.download_subtitle = function(hash, lang, path, cb){
	var params = {hash:hash, language:lang};

	this.get('download', params, function(err, status, res){
		if(err) return cb(err);

		if(status == 400) return cb('Bad Request');
		if(status == 404) return cb(null, ''); // no subtitle found

		fs.writeFile(path, res, {encoding: 'binary'}, function(err) {
			if(err) return cb(err);

			cb(null, path);
		});
	});
};
ep.prototype.upload_subtitle = function(hash, file, cb){
	var params = {hash:hash}
	this.post('upload', file, params, function(err, status, res){
		if(err) return cb(err);

		/*
		        'Uploaded': (HTTP/1.1 201 Created)
            If everything was OK, the HTTP status code 201 will be returned.

         */


		if(status == 403) return cb('Forbidden : subtitle already exists');
		if(status == 415) return cb('Unsupported Media Type');
		if(status == 400) return cb('Bad Request');


		cb(null, status);
	});
};
