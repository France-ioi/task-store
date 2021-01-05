const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// in req: the user code in json
// int res: The response we send to the user (url)
const server = http.createServer((request, response) => {
    if (request.method === 'POST') {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Access-Control-Allow-Credentials', true);

        let body = "";
        request.on('data', data => {
            body += data;
        });
        request.on('end', () => {
            console.log("Body: " + body);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end('post received!')
        });
    } else {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Hello World');
    }
});

// start the server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
