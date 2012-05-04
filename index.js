var http = require('http');
// var sys = require('sys');
var url = require('url');

function start() {

	function not_found(response) {
		response.writeHead(404, {'Content-type': 'text/plain'});
		response.end('404: It\'s not here!');
	}


	function onRequest(b_request, b_response) {
		console.log('Request receieved.');

		// grabs request url
		var b_url = url.parse(b_request.url, true);

		if(!b_url.query || !b_url.query.url) 
			return not_found(b_response);

		// reads and grabs given url 
		var p_url = url.parse(b_url.query.url);

		// initialize http client
		var p_client = http.createClient(p_url.port || 80, p_url.hostname);

		// send get request to get the contents of the given url

		var p_request = p_client.request('GET', p_url.pathname || '/', {
			host: p_url.hostname
		});
		p_request.end();

		p_request.addListener('response', function(p_response){

			// pass headers
			b_response.writeHead(p_response.statusCode, p_response.headers);

			// pass data
			p_response.addListener('data', function(data){
				b_response.write(data);
			});

			// end request
			p_response.addListener('end', function(){
				b_response.end();
			})

		});

		// response.writeHead(200, {'Content-type': 'text/plain'});
		// response.write('Hello World');
		// response.end();
	}

	http.createServer(onRequest).listen(8888);
	console.log('Server has started.');
}

exports.start = start;
