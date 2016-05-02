var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(req, response) {
	
	try {
		var pageToLoad = './index.html';
		
		var page = url.parse(req.url).pathname;
		if(page != "/"){
			pageToLoad = "."+page;
		}
		
		var extname = path.extname(pageToLoad);
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
		}
		
		console.log(pageToLoad);
		fs.readFile(pageToLoad, function(error, content) {
			if (error) {
				response.writeHead(500);
				response.end();
			}
			else {
				response.writeHead(200, { 'Content-Type': contentType });
				response.end(content, 'utf-8');
			}
		});
	} catch (err){
		console.log(err);
	}
});

 

try {
	var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
	var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

	console.log("port : "+server_port); 
	console.log("ip address : "+server_ip_address);
	server.listen(server_port, server_ip_address, function () {
	  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
	});
} catch (err){  
		console.log(err);
}