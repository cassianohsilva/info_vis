var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function(req, res) {

	pathName = url.parse(req.url).pathname;

	var file = __dirname + pathName;
	var ext = pathName.split('.')[1];

	console.log('GET', file);
	console.log(ext);
	
	// res.write('index.html');
	fs.readFile(file, function(err, data) {
		if(err) {
			res.writeHead(404, {'Content-type':'text/plan'});
			res.write('Not found!');
			res.end();
		} else {
			res.writeHead(200, {'Content-type':'text/' + ext});
			res.write(data);
			res.end();
		}
	});

	

}).listen(8000);