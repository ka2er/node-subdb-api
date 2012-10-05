/**
 * User: seb
 * Date: 03/10/12
 * Time: 10:07
 * To change this template use File | Settings | File Templates.
 */

var assert = require("assert");
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

					assert.equal(res.join(','), ["af","cs","da","de","en","es","fi","fr","hu","id","it","la","nl","no","oc","pl","pt","ro","ru","sl","sr","sv","tr"].join(','));
					done();
				});
			});
		});

		describe('#search_subtitles', function(){
			it('should search for subtitles', function(done) {
				var subdb = new SubDb();
				subdb.api.search_subtitles('edc1981d6459c6111fe36205b4aff6c2', function(err, res){
					if(err) return done(err);

					assert.equal(res.join(','), ["en","fr","it","pt"].join(','));
					done();
				});
			});
		});
	});
});

