const http = require('http');
const url = require('url');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const database_helper = require('./database_helper');
const json_sanitizer = require('./json_sanitizer');

const awsApiVersion = '2006-03-01';

AWS.config.getCredentials(function(err) {
    if (err)
        console.err(err.stack);
});

const bucketName = 'task-store.france-ioi.org';
const folder = "quick-pi/";

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

    const s3 = new AWS.S3({apiVersion: awsApiVersion});
    // console.log("Access key:", aws.config.credentials.accessKeyId);
    // console.log("AWS_SECRET_KEY: ", aws.config.credentials.secretAccessKey);
    if (request.method === 'POST') {
        let body = "";
        request.on('data', data => {
            body += data;
        });
        request.on('end', () => {
            // create random key with folder
            var keyUuid = uuid.v4();
            const keyName = folder + keyUuid;

            // we verify that the user input is valid
            const jsonObject = json_sanitizer.sanitizeUserInput(body);
            if (!jsonObject) {
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end("Wrong input, not passing json_sanitizer!");
                console.error("Received invalid json from user!")
                return;
            }

            database_helper.addEntry(jsonObject, keyUuid.toString());

            const objectParams = {Bucket: bucketName, Key: keyName, Body: body};

            const uploadPromise = s3.putObject(objectParams).promise();
            uploadPromise.then(dataUpload => {
                // console.log("Successfully uploaded data to " + bucketName + "/" + keyName)
            }).catch(err => console.error(err, err.stack));

            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end(keyUuid.toString());
        });
    } else {
        const url_parts = url.parse(request.url, true);
        const query = url_parts.query;
        response.writeHead(200, {'Content-Type': 'text/plain'});
        if (!query.id) {
            response.end(JSON.stringify({
                status: "error",
                cause: "query not found"
            }));
        } else {
            const params = {Bucket: bucketName, Key: folder + query.id};
            s3.getObject(params, function (err, data) {
                if (err) {
                    response.end(JSON.stringify({
                        status: "error",
                        cause: "wrong query"
                    }));
                } else {
                    response.end(JSON.stringify({
                        status: "success",
                        data: JSON.parse(data.Body.toString())
                    }));
                }
            });
        }
    }
});

// start the server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
