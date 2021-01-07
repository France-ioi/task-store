const http = require('http');
const url = require('url');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const awsApiVersion = '2006-03-01';

AWS.config.getCredentials(function(err) {
    if (err)
        console.log(err.stack);
});

const bucketName = 'task-store.france-ioi.org';


const hostname = '127.0.0.1';
const port = 3000;

// in req: the user code in json
// int res: The response we send to the user (url)
const server = http.createServer((request, response) => {
    // This allow us to enable that user get our response.end after their post in order to send them the link
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true);
    // console.log("Access key:", aws.config.credentials.accessKeyId);
    // console.log("AWS_SECRET_KEY: ", aws.config.credentials.secretAccessKey);
    if (request.method === 'POST') {
        let body = "";
        request.on('data', data => {
            body += data;
        });
        request.on('end', () => {
            // create random key:
            const keyName = uuid.v4();
            const bucketPromise = new AWS.S3({apiVersion: awsApiVersion})
                .createBucket({Bucket: bucketName}).promise();

            bucketPromise.then(
                function (dataPromise) {
                    const objectParams = {Bucket: bucketName, Key: keyName, Body: body};
                    // const objectParams = {Bucket: bucketName, Key: keyName, Body: "Hello World"};

                    const uploadPromise = new AWS.S3({apiVersion: awsApiVersion})
                        .putObject(objectParams).promise();
                    uploadPromise.then(dataUpload => console.log("Successfully uploaded data to " + bucketName + "/" + keyName));
                }
            ).catch(err => console.error(err, err.stack));

            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(keyName.toString());
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
