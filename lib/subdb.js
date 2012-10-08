var fs = require('fs'),
	crypto = require('crypto'),
	ee = require('events').EventEmitter,
	Api = require('./endpoints.js');


var os = module.exports = function() {
	this.api = new Api();
};

os.prototype.__proto__ = ee.prototype;

os.prototype.computeHash = function(path, cb) {
	// get first 64kb
	// get last 64kb
	// md5 everything

	var file_size = 0;
	var chunk_size = 65536;
	var buf = new Buffer(chunk_size*2);
	var b_read = 0;

	fs.stat(path, function(err, stat){
		if(err) return cb(err);

		file_size = stat.size;

		fs.open(path, 'r', function(err, fd) {
			if(err) return cb(err);

			var t_offsets = [0, file_size-chunk_size];
			for(var i in t_offsets) {
				b_read = fs.readSync(fd, buf, b_read, chunk_size, t_offsets[i]);
			}

			var md5sum = crypto.createHash('md5');
			md5sum.update(buf);
			var d = md5sum.digest('hex');

			cb(null, d);
		});
	});
};


