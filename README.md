node-subdb-api
==============

Node.js API library to query thesubdb.com


Usage
-----

- All api methods are available through subdb.api attributes (see http://thesubdb.com/api/ for methods and arguments).
- A hash method helper is also available

```nodejs
subdb.computeHash(path_to_movie, callback);
```

```js
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
```
For uploading a sub file

```javascript
	SubDb = require("subdb");

	var subdb = new SubDb();
	subdb.api.upload_subtitle(hash, subfile, function(err, res){
		if(err) return err;

		// sub subfile is normally uploaded to thesubdb.com servers
	});
```
