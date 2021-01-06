const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;
let conserved = null;

// in req: the user code in json
// int res: The response we send to the user (url)
const server = http.createServer((request, response) => {
    // This allow us to enable that user get our response.end after their post in order to send them the link
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    if (request.method === 'POST') {
        let body = "";
        request.on('data', data => {
            body += data;
        });
        request.on('end', () => {
            console.log("Body: " + body);
            conserved = body;
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end('post received!')
        });
    } else {
        const url_parts = url.parse(request.url, true);
        const query = url_parts.query;
        console.log("Query: " + JSON.stringify(query));
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end(conserved);
    }
});

// start the server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
