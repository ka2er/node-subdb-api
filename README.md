node-subdb-api
==============

Node.js API library to query thesubdb.com


Usage
-----

For searching a sub file

	SubDb = require("subdb");

	var subdb = new SubDb();
	subdb.computeHash(path_to_movie, function(err, res) {
		if(err) return err;

		var hash = res;
		subdb.api.search_subtitles(hash, function(err, res){

			if(err) return err;

			subdb.api.download_subtitle(hash, res.join(','), 'pathtosub.srt', function(err, res) {
				if(err) return err;

				// sub is normally fetched into pathtosub.srt
			});

		});
	});

for uploading a sub file

	SubDb = require("subdb");

	var subdb = new SubDb();
	subdb.api.upload_subtitle(hash, subfile, function(err, res){
		if(err) return err;

		// sub subfile is normally uploaded to thesubdb.com servers
	});

About
-----

API doc is here : http://thesubdb.com/api/