/**
 * User: seb
 * Date: 03/10/12
 * Time: 10:07
 * To change this template use File | Settings | File Templates.
 */

var assert = require("assert"),
	fs = require('fs'),
	SubDb = require("../lib/subdb.js");

describe('Subdb', function() {

	describe('#computeHash()', function(){

		it('should return a subdb hash of the dexter sample file ', function(done){
			var subdb = new SubDb();
			subdb.computeHash(process.cwd()+'/test/dexter.mp4', function(err, size){
				if (err) return done(err);
				assert.equal(size, 'ffd8d4aa68033dc03d1c8ef373b9028c');
				done();
			});
		});

		it('should return a opensubtitles hash of the justifier sample file ', function(done){
			var subdb = new SubDb();
			subdb.computeHash(process.cwd()+'/test/justified.mp4', function(err, size){
				if (err) return done(err);
				assert.equal(size, 'edc1981d6459c6111fe36205b4aff6c2');
				done();
			});
		});


		it('should return a 128bits length opensubtitles hash of the movie file ', function(done){
			var subdb = new SubDb();
			subdb.computeHash(process.cwd()+'/test/justified.mp4', function(err, size){
				if (err) return done(err);
				assert.equal(size.length, 'edc1981d6459c6111fe36205b4aff6c2'.length);
				done();
			});
		});

	});

	describe('api', function() {

		describe('#available_languages', function(){
			it('should list available languages', function(done) {
				//this.timeout(4000);
				var subdb = new SubDb();
				subdb.api.available_languages(function(err, res){
					if(err) return done(err);

					assert.equal(res.join(','), ["en","es","fr","it","nl","pl","pt","ro","sv","tr"].join(','));
					done();
				});
			});
		});

		describe('#search_subtitles', function(){
			it('should search for subtitles', function(done) {
				var subdb = new SubDb();
				subdb.api.search_subtitles('edc1981d6459c6111fe36205b4aff6c2', function(err, res){
					if(err) return done(err);

					assert.equal(res.join(','), ["en","es","fr","it","pt"].join(','));
					done();
				});
			});
		});


		describe('#download_subtitle', function(){
			it('should download subtitle', function(done) {
				var path = process.cwd()+'/test/justified.srt',
					properlyEncoded = process.cwd() + '/test/justified-FR-ANSI.srt'
				;

				var bufferExpectedFile = fs.readFileSync(properlyEncoded);

				fs.unlink(path, function() {
					var subdb = new SubDb();
					subdb.api.download_subtitle('edc1981d6459c6111fe36205b4aff6c2', 'fr', path, function(err, res){
						if(err) return done(err);

						var bufferActualFile = fs.readFileSync(path);

						assert.equal(bufferActualFile.length, bufferExpectedFile.length);

						for(var i = 0; i < bufferActualFile.length; i++){
							assert.equal(bufferActualFile[i], bufferExpectedFile[i]);
						}

						done();
					});
				});
			});
		});

		describe('#upload_subtitle', function(){
			it('should upload subtitle', function(done) {
				var path = process.cwd()+'/test/justified.srt';
				var subdb = new SubDb();
				subdb.api.upload_subtitle('edc1981d6459c6111fe36205b4aff6c2', path, function(err, res){
					if(err) return done(err);

					assert.equal(res, 200);
					done();
				});
			});
		});
	});
});

