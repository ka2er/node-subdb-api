/**
 * User: seb
 * Date: 10/5/12
 * Time: 5:15 PM
 * To change this template use File | Settings | File Templates.
 */

var querystring = require('querystring'),
	http = require('http');

var ep = module.exports = function() {

	this.options = {
		//'hostname': 'sandbox.thesubdb.com',
		//'hostname': 'permita.se',
		'hostname': 'api.thesubdb.com',
		'agent': false,
		'headers': {
			'Content-length':0,
			'User-Agent': 'SubDB/1.0 (NodeSubdb/0.0.1; http://github.com/ka2er/node-subdb-api)'
		}
	};

	// http://api.thesubdb.com
};

ep.prototype.get = function(action, params, cb) {

	params.action = action;
	this.options.path = "/?"+querystring.stringify(params);

	//console.log(this.options);

	var data = '';
	var req = http.request(this.options);
	req.on('response', function (response) {
		response.on('data', function (chunk) {
			data += chunk;
		}).on('end', function(){
			cb(null, this.statusCode, data);
		});
	}).on('error', function(e) {
		cb(e);
	}).end();
};


/** protocol methods */
ep.prototype.available_languages = function(cb){
	this.get('languages',  {}, function(err, status, res) {
		if(err) return cb(err);

		cb(null, res.split(','));
	});
};
ep.prototype.search_subtitles = function(hash, versions, cb){
	var params = {hash:hash};
	if(typeof versions === 'function') cb = versions;
	else params.version = 1;

	this.get('search', params, function(err, status, res){
		if(err) return cb(err);

		cb(null, res.split(','));
	});
};
ep.prototype.download_subtitle = function(hash, lang, cb){
	this.get('download', function(err, res){
		if(err) return cb(err);

		cb(null, res);
	});
};
ep.prototype.upload_subtitle = function(hash, file, cb){
	this.post('upload', function(err, res){
		if(err) return cb(err);

		cb(null, res);
	});
};
