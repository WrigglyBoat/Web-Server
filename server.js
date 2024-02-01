const http = require('http');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const EventEmitter = require('events');

class Emitter extends EventEmitter{};

const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const serveFile = async(filePath, contentType, response) => { //creating variables
    try{
        const FileData = await fsPromises.readFile(filePath,'utf8');
        response.writeHead(200, {'Content-Type': contentType});
        response.end(FileData);

    } catch(err) {
        console.log(err);
        response.statusCode = 500;
        response.end();
        
    }
}


const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    const extension = path.extname(req.url);

    let contentType;

    switch(extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/js';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break
        default:
            contentType = 'text/html';

        let filePath = 
            contentType === 'text/html' && req.url === '/'
                ?path.join(__dirname, 'views','index.html')
                :contentType === 'text/html' && req.url.slice(-1) === '/'
                    ?path.join(__dirname,'views', req.url, 'index.html')
                    :contentType === 'text/html'
                        ?path.join(__dirname,'views', req.url)
                        :path.join(__dirname, req.url)

    }
})